<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\Prodi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProdiController extends Controller
{
    /**
     * Display a listing of active prodis.
     */
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
