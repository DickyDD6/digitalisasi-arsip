<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DocumentTypeController extends Controller
{
    /**
     * Display a listing of document types.
     */
    public function index(Request $request): JsonResponse
    {
        $types = DocumentType::orderBy('id', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $types,
        ]);
    }
}
