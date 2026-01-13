<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadDocumentRequest;
use App\Http\Resources\DocumentResource;
use App\Models\Document;
use App\Services\DocumentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

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

        // Search by file name
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('file_name', 'like', "%{$search}%");
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        $documents = $query->orderBy('created_at', 'desc')->paginate($perPage);

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

        // Stream file with proper headers
        return Storage::download(
            $document->file_path,
            $document->file_name,
            [
                'Content-Type' => 'application/pdf',
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
            ->where('status', 'menunggu_verifikasi')
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

            $message = $verified->status === 'terverifikasi'
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
}
