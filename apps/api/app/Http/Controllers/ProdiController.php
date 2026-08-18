<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\Prodi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ProdiController extends Controller
{
    /**
     * Display a listing of active prodis.
     */
    #[OA\Get(
        path: '/api/prodis',
        summary: 'Daftar program studi aktif (UC-15)',
        description: 'Mengambil seluruh daftar program studi aktif di lingkungan fakultas.',
        security: [['cookieAuth' => []]],
        tags: ['Master Data'],
        responses: [
            new OA\Response(response: 200, description: 'Daftar program studi berhasil diambil', content: new OA\JsonContent(ref: '#/components/schemas/ProdiListResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $prodis = Prodi::where('is_active', true)
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $prodis,
        ]);
    }

    /**
     * Store a newly created prodi (Manager only).
     */
    #[OA\Post(
        path: '/api/prodis',
        summary: 'Tambah program studi baru (UC-15) - Manager only',
        description: 'Menambahkan data program studi baru ke database master data. Hanya dapat diakses oleh Manager.',
        security: [['cookieAuth' => []]],
        tags: ['Master Data'],
        requestBody: new OA\RequestBody(
            required: true,
            description: 'Data program studi baru',
            content: new OA\JsonContent(ref: '#/components/schemas/CreateProdiRequest')
        ),
        responses: [
            new OA\Response(response: 201, description: 'Program studi berhasil ditambahkan', content: new OA\JsonContent(ref: '#/components/schemas/ProdiResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 403, description: 'Forbidden (Bukan Manager)', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 422, description: 'Validation Error', content: new OA\JsonContent(ref: '#/components/schemas/ValidationError')),
        ]
    )]
    public function store(Request $request): JsonResponse
    {
        if (!$request->user()->hasRole(UserRole::MANAGER)) {
            return response()->json([
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'code' => 'required|string|max:20|unique:prodis,code',
            'name' => 'required|string|max:100',
            'degree' => 'required|string|max:20',
            'is_active' => 'nullable|boolean',
        ]);

        $prodi = Prodi::create([
            'code' => strtoupper($validated['code']),
            'name' => $validated['name'],
            'degree' => strtoupper($validated['degree']),
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Program Studi berhasil ditambahkan.',
            'data' => $prodi,
        ], 201);
    }
}
