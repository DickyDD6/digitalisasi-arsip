<?php

namespace App\Services;

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
                'status' => 'menunggu_verifikasi',
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
            description: "Dokumen {$document->document_type} '{$document->file_name}' diunggah untuk prodi {$document->prodi}.",
            metadata: [
                'document_id' => $document->id,
                'document_type' => $document->document_type,
                'file_name' => $document->file_name,
                'file_size' => $document->file_size,
                'prodi' => $document->prodi,
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
        if ($document->status !== 'menunggu_verifikasi') {
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
        $action = $status === 'terverifikasi' ? 'verify_document' : 'reject_document';
        $description = $status === 'terverifikasi'
            ? "Dokumen '{$document->file_name}' diverifikasi."
            : "Dokumen '{$document->file_name}' ditolak.";

        $metadata = [
            'document_id' => $document->id,
            'document_type' => $document->document_type,
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
}
