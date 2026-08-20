<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateDocumentRequest;
use App\Http\Requests\UploadDocumentRequest;
use App\Http\Requests\VerifyDocumentRequest;
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
use OpenApi\Attributes as OA;

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
    #[OA\Get(
        path: '/api/documents',
        operationId: 'listDocuments',
        summary: 'List Documents',
        description: 'Mengambil daftar dokumen',
        security: [['cookieAuth' => []]],
        tags: ['Documents'],
        parameters: [
            new OA\Parameter(name: 'document_type', in: 'query', description: 'Filter berdasarkan tipe dokumen', schema: new OA\Schema(type: 'string', enum: ['nilai', 'transkrip', 'ijazah', 'berita_acara_sidang'])),
            new OA\Parameter(name: 'status', in: 'query', description: 'Filter berdasarkan status', schema: new OA\Schema(type: 'string', enum: ['menunggu_verifikasi', 'terverifikasi', 'tidak_terverifikasi'])),
            new OA\Parameter(name: 'prodi', in: 'query', description: 'Filter berdasarkan program studi', schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'search', in: 'query', description: 'Cari berdasarkan nama file', schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'sort_by', in: 'query', description: 'Kolom untuk sorting (default: created_at)', schema: new OA\Schema(type: 'string', default: 'created_at', enum: ['created_at', 'updated_at', 'tahun_lulus', 'status', 'document_type', 'prodi', 'file_name'])),
            new OA\Parameter(name: 'sort_direction', in: 'query', description: 'Arah sorting (asc/desc, default: desc)', schema: new OA\Schema(type: 'string', default: 'desc', enum: ['asc', 'desc'])),
            new OA\Parameter(name: 'per_page', in: 'query', description: 'Jumlah data per halaman', schema: new OA\Schema(type: 'integer', default: 15)),
            new OA\Parameter(name: 'page', in: 'query', description: 'Nomor halaman', schema: new OA\Schema(type: 'integer', default: 1)),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Daftar dokumen berhasil diambil', content: new OA\JsonContent(ref: '#/components/schemas/DocumentListResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.')])),
            new OA\Response(response: 403, description: 'Forbidden', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'This action is unauthorized.')])),
        ]
    )]
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

        // Filter by nim / npm
        if ($request->has('nim') || $request->has('npm')) {
            $nim = $request->input('nim') ?? $request->input('npm');
            $query->where('npm', 'like', "%{$nim}%");
        }

        // Filter by mata_kuliah
        if ($request->has('mata_kuliah')) {
            $query->where('mata_kuliah', 'like', "%{$request->input('mata_kuliah')}%");
        }

        // Filter by tahun_akademik / tahun_ajaran
        if ($request->has('tahun_akademik') || $request->has('tahun_ajaran')) {
            $tahun = $request->input('tahun_akademik') ?? $request->input('tahun_ajaran');
            $query->where('tahun_ajaran', 'like', "%{$tahun}%");
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }
        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
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
    #[OA\Post(
        path: '/api/documents',
        operationId: 'uploadDocument',
        summary: 'Upload Document (UC-04)',
        description: "Upload dokumen baru (Manager & Uploader only).\n\n**Tipe dokumen dan field yang diperlukan:**\n- `nilai`: prodi, tahun_ajaran, mata_kuliah, kelas\n- `ijazah` / `transkrip` / `berita_acara_sidang`: prodi, tahun_lulus, npm",
        security: [['cookieAuth' => []]],
        tags: ['Documents'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(ref: '#/components/schemas/UploadDocumentRequest')
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Dokumen berhasil diunggah', content: new OA\JsonContent(ref: '#/components/schemas/DocumentResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.')])),
            new OA\Response(response: 403, description: 'Forbidden', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'This action is unauthorized.')])),
            new OA\Response(
                response: 409,
                description: 'Dokumen duplikat terdeteksi',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Dokumen duplikat terdeteksi.'),
                        new OA\Property(property: 'errors', type: 'object', properties: [
                            new OA\Property(property: 'duplicate', type: 'array', items: new OA\Items(type: 'string')),
                        ]),
                    ]
                )
            ),
            new OA\Response(response: 422, description: 'Validation Error', content: new OA\JsonContent(ref: '#/components/schemas/ValidationError')),
        ]
    )]
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
    #[OA\Get(
        path: '/api/documents/{id}',
        operationId: 'getDocument',
        summary: 'Get Document Detail',
        description: 'Mengambil detail dokumen berdasarkan ID',
        security: [['cookieAuth' => []]],
        tags: ['Documents'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'Document ID', schema: new OA\Schema(type: 'integer', example: 1)),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Detail dokumen berhasil diambil', content: new OA\JsonContent(ref: '#/components/schemas/DocumentResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.')])),
            new OA\Response(response: 403, description: 'Forbidden', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'This action is unauthorized.')])),
            new OA\Response(response: 404, description: 'Not Found', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Not Found.')])),
        ]
    )]
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
    #[OA\Get(
        path: '/api/documents/{id}/download',
        operationId: 'downloadDocument',
        summary: 'Download Document (UC-10)',
        description: "Download file dokumen.\n\n**Aturan akses download:**\n- Dokumen **terverifikasi**: semua role bisa download\n- Dokumen **belum terverifikasi**:\n  - Manager: bisa download semua dokumen\n  - Uploader: hanya dokumen miliknya sendiri\n  - QC: hanya dokumen pending (untuk verifikasi)\n  - SBAP: tidak bisa download",
        security: [['cookieAuth' => []]],
        tags: ['Documents'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'Document ID', schema: new OA\Schema(type: 'integer', example: 1)),
        ],
        responses: [
            new OA\Response(response: 200, description: 'File PDF', content: new OA\MediaType(mediaType: 'application/pdf', schema: new OA\Schema(type: 'string', format: 'binary'))),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.')])),
            new OA\Response(response: 403, description: 'Forbidden', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'This action is unauthorized.')])),
            new OA\Response(response: 404, description: 'Not Found', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Not Found.')])),
        ]
    )]
    public function download(Document $document)
    {
        $this->authorize('download', $document);

        // Check if file exists
        if (!Storage::disk('public')->exists($document->file_path)) {
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
    #[OA\Post(
        path: '/api/documents/download-multiple',
        operationId: 'downloadMultipleDocuments',
        summary: 'Download Multiple Documents (ZIP)',
        description: "Download beberapa dokumen sekaligus dalam format ZIP.\n\nAkses download sesuai dengan policy:\n- Manager: semua dokumen\n- Uploader: dokumen milik sendiri\n- QC: dokumen pending (untuk verifikasi)\n- SBAP: dokumen terverifikasi saja",
        security: [['cookieAuth' => []]],
        tags: ['Documents'],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(ref: '#/components/schemas/DeleteMultipleRequest')),
        responses: [
            new OA\Response(response: 200, description: 'File ZIP berisi dokumen', content: new OA\MediaType(mediaType: 'application/zip', schema: new OA\Schema(type: 'string', format: 'binary'))),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.')])),
            new OA\Response(response: 403, description: 'Forbidden', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'This action is unauthorized.')])),
            new OA\Response(response: 422, description: 'Validation Error', content: new OA\JsonContent(ref: '#/components/schemas/ValidationError')),
        ]
    )]
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
        AuditLog::log(
            action: AuditAction::DOWNLOAD_DOCUMENT->value,
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
    #[OA\Get(
        path: '/api/documents/{id}/view',
        operationId: 'viewDocument',
        summary: 'View Document Inline (PDF Viewer)',
        description: "Menampilkan file dokumen secara inline (untuk PDF viewer di browser).\n\nSemua user yang terautentikasi dapat melihat dokumen.",
        security: [['cookieAuth' => []]],
        tags: ['Documents'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'Document ID', schema: new OA\Schema(type: 'integer', example: 1)),
        ],
        responses: [
            new OA\Response(response: 200, description: 'File PDF inline', content: new OA\MediaType(mediaType: 'application/pdf', schema: new OA\Schema(type: 'string', format: 'binary'))),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.')])),
            new OA\Response(response: 403, description: 'Forbidden', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'This action is unauthorized.')])),
            new OA\Response(response: 404, description: 'Not Found', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Not Found.')])),
        ]
    )]
    public function view(Document $document)
    {
        $this->authorize('view', $document);

        // Check if file exists
        if (!Storage::disk('public')->exists($document->file_path)) {
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
    #[OA\Delete(
        path: '/api/documents/{id}',
        operationId: 'deleteDocument',
        summary: 'Delete Document (UC-07)',
        description: "Menghapus dokumen (hanya untuk dokumen dengan status `tidak_terverifikasi`).\n\nManager dapat menghapus semua dokumen rejected.\nUploader hanya dapat menghapus dokumen miliknya sendiri.",
        security: [['cookieAuth' => []]],
        tags: ['Documents'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'Document ID', schema: new OA\Schema(type: 'integer', example: 1)),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Dokumen berhasil dihapus', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Dokumen berhasil dihapus.')])),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.')])),
            new OA\Response(response: 403, description: 'Tidak memiliki izin atau dokumen sudah terverifikasi', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 404, description: 'Not Found', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Not Found.')])),
        ]
    )]
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
    #[OA\Post(
        path: '/api/documents/delete-multiple',
        operationId: 'deleteMultipleDocuments',
        summary: 'Delete Multiple Documents',
        description: "Menghapus beberapa dokumen sekaligus.\n\nHanya dokumen dengan status `tidak_terverifikasi` yang dapat dihapus.\nManager dapat menghapus semua dokumen rejected. Uploader hanya dokumen miliknya.",
        security: [['cookieAuth' => []]],
        tags: ['Documents'],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(ref: '#/components/schemas/DeleteMultipleRequest')),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Dokumen berhasil dihapus',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: '3 dokumen berhasil dihapus.'),
                        new OA\Property(property: 'deleted_count', type: 'integer', example: 3),
                    ]
                )
            ),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.')])),
            new OA\Response(response: 403, description: 'Forbidden', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'This action is unauthorized.')])),
            new OA\Response(response: 422, description: 'Validation Error', content: new OA\JsonContent(ref: '#/components/schemas/ValidationError')),
        ]
    )]
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
    #[OA\Put(
        path: '/api/documents/{id}',
        operationId: 'updateDocument',
        summary: 'Update Document (UC-06)',
        description: "Update metadata dokumen (hanya untuk dokumen dengan status `tidak_terverifikasi`).\n\nSetelah update, status akan direset ke `menunggu_verifikasi`.\nFile dan document_type tidak dapat diubah.",
        security: [['cookieAuth' => []]],
        tags: ['Documents'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'Document ID', schema: new OA\Schema(type: 'integer', example: 1)),
        ],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(ref: '#/components/schemas/UpdateDocumentRequest')),
        responses: [
            new OA\Response(response: 200, description: 'Dokumen berhasil diperbarui', content: new OA\JsonContent(ref: '#/components/schemas/DocumentResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.')])),
            new OA\Response(response: 403, description: 'Forbidden', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'This action is unauthorized.')])),
            new OA\Response(response: 404, description: 'Not Found', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Not Found.')])),
            new OA\Response(response: 422, description: 'Dokumen yang sudah terverifikasi tidak dapat diperbarui', content: new OA\JsonContent(ref: '#/components/schemas/ValidationError')),
        ]
    )]
    public function update(
        UpdateDocumentRequest $request,
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
    #[OA\Get(
        path: '/api/documents/pending',
        operationId: 'listPendingDocuments',
        summary: 'List Pending Documents (UC-08)',
        description: 'Mengambil daftar dokumen yang menunggu verifikasi (Manager & QC only)',
        security: [['cookieAuth' => []]],
        tags: ['Documents'],
        parameters: [
            new OA\Parameter(name: 'per_page', in: 'query', description: 'Jumlah data per halaman', schema: new OA\Schema(type: 'integer', default: 15)),
            new OA\Parameter(name: 'page', in: 'query', description: 'Nomor halaman', schema: new OA\Schema(type: 'integer', default: 1)),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Daftar dokumen pending berhasil diambil', content: new OA\JsonContent(ref: '#/components/schemas/DocumentListResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.')])),
            new OA\Response(response: 403, description: 'Forbidden', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'This action is unauthorized.')])),
        ]
    )]
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
    #[OA\Patch(
        path: '/api/documents/{id}/verify',
        operationId: 'verifyDocument',
        summary: 'Verify Document (UC-08)',
        description: "Verifikasi atau tolak dokumen (Manager & QC only).\n\nDokumen yang sudah terverifikasi sebelumnya tidak dapat diverifikasi ulang.",
        security: [['cookieAuth' => []]],
        tags: ['Documents'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'Document ID', schema: new OA\Schema(type: 'integer', example: 1)),
        ],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(ref: '#/components/schemas/VerifyDocumentRequest')),
        responses: [
            new OA\Response(response: 200, description: 'Dokumen berhasil diverifikasi/ditolak', content: new OA\JsonContent(ref: '#/components/schemas/DocumentResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.')])),
            new OA\Response(response: 403, description: 'Forbidden', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'This action is unauthorized.')])),
            new OA\Response(response: 404, description: 'Not Found', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Not Found.')])),
            new OA\Response(response: 422, description: 'Dokumen sudah diverifikasi sebelumnya', content: new OA\JsonContent(ref: '#/components/schemas/ValidationError')),
        ]
    )]
    public function verify(
        VerifyDocumentRequest $request,
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
    #[OA\Get(
        path: '/api/documents/statistics',
        operationId: 'getDocumentStatistics',
        summary: 'Get Document Statistics',
        description: 'Mengambil statistik dokumen: total, verified, pending, rejected (Manager only)',
        security: [['cookieAuth' => []]],
        tags: ['Statistics'],
        responses: [
            new OA\Response(response: 200, description: 'Statistik dokumen berhasil diambil', content: new OA\JsonContent(ref: '#/components/schemas/DocumentStatisticsResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.')])),
            new OA\Response(response: 403, description: 'Forbidden', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'This action is unauthorized.')])),
        ]
    )]
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
