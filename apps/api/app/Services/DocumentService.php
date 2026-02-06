<?php

namespace App\Services;

use App\Enums\DocumentStatus;
use App\Models\AuditLog;
use App\Models\Document;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class DocumentService
{
    /**
     * Upload a new document with duplicate check.
     *
     * @param array $data
     * @param UploadedFile $file
     * @param int $userId
     * @return Document
     * @throws ConflictHttpException
     */
    public function uploadDocument(array $data, UploadedFile $file, int $userId): Document
    {
        // Generate duplicate key
        $duplicateKey = Document::generateDuplicateKey($data);

        DB::beginTransaction();

        try {
            // Store file in private storage
            $filePath = $this->storeFile($file, $data['document_type']);

            // Create document record
            $document = Document::create([
                'document_type' => $data['document_type'],
                'duplicate_key' => $duplicateKey,
                'file_path' => $filePath,
                'file_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'prodi' => $data['prodi'],
                'tahun_ajaran' => $data['tahun_ajaran'] ?? null,
                'mata_kuliah' => $data['mata_kuliah'] ?? null,
                'kelas' => $data['kelas'] ?? null,
                'tahun_lulus' => $data['tahun_lulus'] ?? null,
                'npm' => $data['npm'] ?? null,
                'status' => \App\Enums\DocumentStatus::PENDING->value,
                'uploaded_by' => $userId,
            ]);

            // Log upload activity
            $this->logUpload($document, $userId);

            DB::commit();

            return $document->fresh(['uploader']);
        } catch (\Illuminate\Database\QueryException $e) {
            DB::rollBack();

            // Delete file if database transaction fails
            if (isset($filePath)) {
                Storage::delete($filePath);
            }

            // Check if it's a duplicate key violation (MySQL error code 23000)
            if ($e->getCode() === '23000' && str_contains($e->getMessage(), 'duplicate_key')) {
                throw new ConflictHttpException(
                    $this->getDuplicateMessage($data['document_type'])
                );
            }

            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();

            // Delete file if database transaction fails
            if (isset($filePath)) {
                Storage::delete($filePath);
            }

            throw $e;
        }
    }

    /**
     * Get duplicate message based on document type.
     *
     * @param string $documentType
     * @return string
     */
    protected function getDuplicateMessage(string $documentType): string
    {
        if ($documentType === 'nilai') {
            return 'Dokumen nilai dengan kombinasi tahun ajaran, prodi, mata kuliah, dan kelas yang sama sudah ada.';
        }

        return "Dokumen {$documentType} dengan kombinasi prodi, tahun lulus, dan NPM yang sama sudah ada.";
    }

    /**
     * Store uploaded file in private storage.
     *
     * @param UploadedFile $file
     * @param string $documentType
     * @return string File path
     */
    protected function storeFile(UploadedFile $file, string $documentType): string
    {
        // Store in archives/{document_type}/YYYY/MM/ directory structure
        $directory = sprintf(
            'archives/%s/%s/%s',
            $documentType,
            now()->format('Y'),
            now()->format('m')
        );

        // Use Storage::putFile to auto-generate unique filename
        return Storage::putFile($directory, $file);
    }

    /**
     * Log document upload activity.
     *
     * @param Document $document
     * @param int $userId
     * @return void
     */
    protected function logUpload(Document $document, int $userId): void
    {
        AuditLog::log(
            action: 'upload_document',
            description: "Dokumen {$document->document_type->value} '{$document->file_name}' diunggah untuk prodi {$document->prodi->value}.",
            metadata: [
                'document_id' => $document->id,
                'document_type' => $document->document_type->value,
                'file_name' => $document->file_name,
                'file_size' => $document->file_size,
                'prodi' => $document->prodi->value,
            ],
            modelType: Document::class,
            modelId: $document->id
        );
    }

    /**
     * Delete a document and its file.
     *
     * @param Document $document
     * @return bool
     */
    public function deleteDocument(Document $document): bool
    {
        DB::beginTransaction();

        try {
            $documentId = $document->id;
            $fileName = $document->file_name;
            $filePath = $document->file_path;

            // Delete document record
            $deleted = $document->delete();

            if ($deleted) {
                // Delete physical file
                Storage::delete($filePath);

                // Log deletion
                AuditLog::log(
                    action: 'delete_document',
                    description: "Dokumen '{$fileName}' dihapus.",
                    metadata: [
                        'document_id' => $documentId,
                        'file_name' => $fileName,
                    ]
                );
            }

            DB::commit();

            return $deleted;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Verify or reject a document.
     *
     * @param Document $document
     * @param string $status
     * @param string|null $note
     * @param int $verifierId
     * @return Document
     * @throws \Illuminate\Validation\ValidationException
     */
    public function verifyDocument(
        Document $document,
        string $status,
        ?string $note,
        int $verifierId
    ): Document {
        // Validate document is still pending
        if ($document->status !== DocumentStatus::PENDING) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'document' => ['Dokumen sudah diverifikasi sebelumnya dan tidak dapat diverifikasi ulang.'],
            ]);
        }

        DB::beginTransaction();

        try {
            // Update document
            $document->update([
                'status' => $status,
                'verification_note' => $note,
                'verified_by' => $verifierId,
                'verified_at' => now(),
            ]);

            // Log verification activity
            $this->logVerification($document, $status, $verifierId);

            DB::commit();

            return $document->fresh(['uploader', 'verifier']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Log document verification activity.
     *
     * @param Document $document
     * @param string $status
     * @param int $verifierId
     * @return void
     */
    protected function logVerification(Document $document, string $status, int $verifierId): void
    {
        $action = $status === DocumentStatus::VERIFIED->value ? 'verify_document' : 'reject_document';
        $description = $status === DocumentStatus::VERIFIED->value
            ? "Dokumen '{$document->file_name}' diverifikasi."
            : "Dokumen '{$document->file_name}' ditolak.";

        $metadata = [
            'document_id' => $document->id,
            'document_type' => $document->document_type->value,
            'verifier_id' => $verifierId,
            'status' => $status,
        ];

        if ($document->verification_note) {
            $metadata['verification_note'] = $document->verification_note;
            $description .= " Catatan: {$document->verification_note}";
        }

        AuditLog::log(
            action: $action,
            description: $description,
            metadata: $metadata,
            modelType: Document::class,
            modelId: $document->id
        );
    }

    /**
     * Update document metadata.
     *
     * @param Document $document
     * @param array $data
     * @param int $userId
     * @return Document
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateDocument(
        Document $document,
        array $data,
        int $userId
    ): Document {
        // Check if document can be updated (only rejected documents can be updated by uploader)
        // Manager can update any document, so we check the user role
        $user = \App\Models\User::find($userId);
        if ($user && $user->hasRole('uploader') && $document->status !== DocumentStatus::REJECTED) {
            $statusMessage = $document->status === DocumentStatus::VERIFIED
                ? 'Dokumen yang sudah terverifikasi tidak dapat diperbarui.'
                : 'Dokumen yang sedang menunggu verifikasi tidak dapat diperbarui.';

            throw \Illuminate\Validation\ValidationException::withMessages([
                'document' => [$statusMessage],
            ]);
        }

        // Generate new duplicate key with updated data
        $updatedData = array_merge([
            'document_type' => $document->document_type,
            'prodi' => $document->prodi,
            'tahun_ajaran' => $document->tahun_ajaran,
            'mata_kuliah' => $document->mata_kuliah,
            'kelas' => $document->kelas,
            'tahun_lulus' => $document->tahun_lulus,
            'npm' => $document->npm,
        ], $data);

        $newDuplicateKey = Document::generateDuplicateKey($updatedData);

        // Check for duplicates (excluding current document)
        if ($newDuplicateKey !== $document->duplicate_key) {
            $exists = Document::where('duplicate_key', $newDuplicateKey)
                ->where('id', '!=', $document->id)
                ->exists();

            if ($exists) {
                $documentType = $document->document_type;
                $message = $documentType === 'nilai'
                    ? 'Dokumen nilai dengan kombinasi tahun ajaran, prodi, mata kuliah, dan kelas yang sama sudah ada.'
                    : "Dokumen {$documentType} dengan kombinasi prodi, tahun lulus, dan NPM yang sama sudah ada.";

                throw \Illuminate\Validation\ValidationException::withMessages([
                    'duplicate' => [$message],
                ]);
            }
        }

        DB::beginTransaction();

        try {
            // Update document metadata and reset verification status
            $updatePayload = array_merge($data, [
                'duplicate_key' => $newDuplicateKey,
                'status' => 'menunggu_verifikasi',
                'verified_by' => null,
                'verified_at' => null,
                'verification_note' => null,
            ]);

            $document->update($updatePayload);

            // Log update activity
            $this->logUpdate($document, $userId, $data);

            DB::commit();

            return $document->fresh(['uploader', 'verifier']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Log document update activity.
     *
     * @param Document $document
     * @param int $userId
     * @param array $updatedFields
     * @return void
     */
    protected function logUpdate(Document $document, int $userId, array $updatedFields): void
    {
        $fieldNames = implode(', ', array_keys($updatedFields));

        AuditLog::log(
            action: 'update_document',
            description: "Dokumen '{$document->file_name}' diperbarui. Field yang diubah: {$fieldNames}",
            metadata: [
                'document_id' => $document->id,
                'document_type' => $document->document_type->value,
                'updated_by' => $userId,
                'updated_fields' => $updatedFields,
                'status_reset' => 'menunggu_verifikasi',
            ],
            modelType: Document::class,
            modelId: $document->id
        );
    }
}
