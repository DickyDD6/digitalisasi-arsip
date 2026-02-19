<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadDocumentRequest;
use App\Http\Resources\DocumentResource;
use App\Models\Document;
use App\Services\DocumentService;
use App\Enums\AuditAction;
use App\Enums\ModelType;
use App\Enums\DocumentStatus;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use ZipArchive;

class DocumentController extends Controller
{
    protected DocumentService $documentService;

    public function __construct(DocumentService $documentService)
    {
        $this->documentService = $documentService;
    }

    /**
     * Display a listing of documents.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Document::class);

        $query = Document::with(['uploader', 'verifier']);

        // Filter by document type
        if ($request->has('document_type')) {
            $query->where('document_type', $request->input('document_type'));
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by prodi
        if ($request->has('prodi')) {
            $query->where('prodi', 'like', "%{$request->input('prodi')}%");
        }

        // Search by all fields
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('file_name', 'like', "%{$search}%")
                    ->orWhere('tahun_ajaran', 'like', "%{$search}%")
                    ->orWhere('mata_kuliah', 'like', "%{$search}%")
                    ->orWhere('npm', 'like', "%{$search}%")
                    ->orWhere('document_type', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%");
            });
        }

        // Sorting
        $allowedSorts = ['created_at', 'updated_at', 'tahun_lulus', 'status', 'document_type', 'prodi', 'file_name'];
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');

        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }

        if (!in_array(strtolower($sortDirection), ['asc', 'desc'])) {
            $sortDirection = 'desc';
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        $documents = $query->orderBy($sortBy, $sortDirection)->paginate($perPage);

        return response()->json([
            'message' => 'Daftar dokumen berhasil diambil.',
            'data' => DocumentResource::collection($documents),
            'meta' => [
                'current_page' => $documents->currentPage(),
                'last_page' => $documents->lastPage(),
                'per_page' => $documents->perPage(),
                'total' => $documents->total(),
            ],
        ], 200);
    }

    /**
     * Store a newly uploaded document.
     */
    public function store(UploadDocumentRequest $request): JsonResponse
    {
        $this->authorize('create', Document::class);

        try {
            $data = $request->validatedData();
            $file = $request->file('file');
            $userId = auth()->id();

            $document = $this->documentService->uploadDocument($data, $file, $userId);

            return response()->json([
                'message' => 'Dokumen berhasil diunggah.',
                'data' => new DocumentResource($document),
            ], 201);
        } catch (ConflictHttpException $e) {
            return response()->json([
                'message' => 'Dokumen duplikat terdeteksi.',
                'errors' => [
                    'duplicate' => [$e->getMessage()],
                ],
            ], 409);
        }
    }

    /**
     * Display the specified document.
     */
    public function show(Document $document): JsonResponse
    {
        $this->authorize('view', $document);

        $document->load(['uploader', 'verifier']);

        return response()->json([
            'message' => 'Detail dokumen berhasil diambil.',
            'data' => new DocumentResource($document),
        ], 200);
    }

    /**
     * Download the specified document.
     */
    public function download(Document $document)
    {
        $this->authorize('download', $document);

        // Check if file exists
        if (!Storage::exists($document->file_path)) {
            abort(404, 'File tidak ditemukan.');
        }

        // Log download activity
        AuditLog::log(
            action: AuditAction::DOWNLOAD_DOCUMENT->value,
            description: "Dokumen '{$document->file_name}' diunduh.",
            metadata: [
                'document_id' => $document->id,
                'document_type' => $document->document_type->value,
                'file_name' => $document->file_name,
                'prodi' => $document->prodi->value,
            ],
            modelType: ModelType::DOCUMENT->value,
            modelId: $document->id
        );

        // Stream file with proper headers
        return Storage::disk('public')->download(
            $document->file_path,
            $document->file_name,
            [
                'Content-Type' => 'application/pdf',
            ]
        );
    }

    /**
     * Download multiple documents as ZIP
     */
    public function downloadMultiple(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:documents,id',
        ]);

        $documentIds = $request->input('ids');
        $documents = Document::whereIn('id', $documentIds)->get();

        // Check authorization for each document
        foreach ($documents as $document) {
            $this->authorize('download', $document);
        }

        // Create temporary zip file
        $zipFileName = 'documents_' . now()->format('YmdHis') . '.zip';
        $zipPath = storage_path('app/temp/' . $zipFileName);

        // Ensure temp directory exists
        if (!file_exists(storage_path('app/temp'))) {
            mkdir(storage_path('app/temp'), 0755, true);
        }

        $zip = new ZipArchive();
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            abort(500, 'Gagal membuat file ZIP');
        }

        // Add files to zip
        foreach ($documents as $document) {
            $filePath = Storage::disk('public')->path($document->file_path);

            if (file_exists($filePath)) {
                // Add file with original name (handle duplicates)
                $fileName = $document->file_name;
                $counter = 1;

                while ($zip->locateName($fileName) !== false) {
                    $pathInfo = pathinfo($document->file_name);
                    $fileName = $pathInfo['filename'] . '_' . $counter . '.' . $pathInfo['extension'];
                    $counter++;
                }

                $zip->addFile($filePath, $fileName);
            }
        }

        $zip->close();

        // Log download activity
        \App\Models\AuditLog::log(
            action: 'download_multiple_documents',
            description: "Mengunduh " . count($documents) . " dokumen sebagai ZIP.",
            metadata: [
                'document_ids' => $documentIds,
                'total_files' => count($documents),
            ]
        );

        // Return zip file and delete after download
        return response()->download($zipPath, $zipFileName)->deleteFileAfterSend(true);
    }

    /**
     * View the specified document inline (PDF Viewer).
     */
    public function view(Document $document)
    {
        $this->authorize('view', $document);

        // Check if file exists
        if (!Storage::exists($document->file_path)) {
            abort(404, 'File tidak ditemukan.');
        }

        // Log view activity
        AuditLog::log(
            action: AuditAction::VIEW_DOCUMENT->value,
            description: "Dokumen '{$document->file_name}' dilihat.",
            metadata: [
                'document_id' => $document->id,
                'document_type' => $document->document_type->value,
                'file_name' => $document->file_name,
                'prodi' => $document->prodi->value,
            ],
            modelType: ModelType::DOCUMENT->value,
            modelId: $document->id
        );

        // Stream file inline
        return Storage::disk('public')->response(
            $document->file_path,
            $document->file_name,
            [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . $document->file_name . '"',
            ]
        );
    }


    /**
     * Remove the specified document.
     */
    public function destroy(Document $document): JsonResponse
    {
        $this->authorize('delete', $document);

        $this->documentService->deleteDocument($document);

        return response()->json([
            'message' => 'Dokumen berhasil dihapus.',
        ], 200);
    }

    /**
     * Remove multiple documents.
     */
    public function destroyMultiple(Request $request): JsonResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:documents,id',
        ]);

        $documentIds = $request->input('ids');
        $documents = Document::whereIn('id', $documentIds)->get();

        foreach ($documents as $document) {
            $this->authorize('delete', $document);
        }

        foreach ($documents as $document) {
            $this->documentService->deleteDocument($document);
        }

        return response()->json([
            'message' => count($documents) . ' dokumen berhasil dihapus.',
            'deleted_count' => count($documents),
        ], 200);
    }

    /**
     * Update the specified document.
     */
    public function update(
        \App\Http\Requests\UpdateDocumentRequest $request,
        Document $document
    ): JsonResponse {
        $this->authorize('update', $document);

        try {
            $updated = $this->documentService->updateDocument(
                $document,
                $request->validated(),
                auth()->id()
            );

            return response()->json([
                'message' => 'Dokumen berhasil diperbarui. Status direset ke menunggu verifikasi.',
                'data' => new DocumentResource($updated),
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Display pending documents awaiting verification.
     */
    public function pending(Request $request): JsonResponse
    {
        $this->authorize('viewPending', Document::class);

        $query = Document::with(['uploader'])
            ->where('status', DocumentStatus::PENDING->value)
            ->orderBy('created_at', 'asc');

        // Pagination
        $perPage = $request->input('per_page', 15);
        $documents = $query->paginate($perPage);

        return response()->json([
            'message' => 'Daftar dokumen menunggu verifikasi.',
            'data' => DocumentResource::collection($documents),
            'meta' => [
                'current_page' => $documents->currentPage(),
                'last_page' => $documents->lastPage(),
                'per_page' => $documents->perPage(),
                'total' => $documents->total(),
            ],
        ], 200);
    }

    /**
     * Verify or reject a document.
     */
    public function verify(
        \App\Http\Requests\VerifyDocumentRequest $request,
        Document $document
    ): JsonResponse {
        $this->authorize('verify', $document);

        try {
            $verified = $this->documentService->verifyDocument(
                $document,
                $request->input('status'),
                $request->input('verification_note'),
                auth()->id()
            );

            $message = $verified->status === DocumentStatus::VERIFIED
                ? 'Dokumen berhasil diverifikasi.'
                : 'Dokumen ditolak.';

            return response()->json([
                'message' => $message,
                'data' => new DocumentResource($verified),
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Get document statistics.
     */
    public function statistics(): JsonResponse
    {
        $this->authorize('viewAny', Document::class);

        $stats = $this->documentService->getStatistics();

        return response()->json([
            'message' => 'Statistik dokumen berhasil diambil.',
            'data' => $stats,
        ], 200);
    }
}
