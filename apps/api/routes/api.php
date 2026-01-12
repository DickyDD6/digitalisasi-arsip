<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authentication routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // User Management (UC-01) - Only accessible by manager
    Route::apiResource('users', UserController::class);

    // Document Verification (UC-08) - QC & Manager only
    // IMPORTANT: These must be BEFORE apiResource to prevent route collision
    Route::get('/documents/pending', [DocumentController::class, 'pending']);
    Route::patch('/documents/{document}/verify', [DocumentController::class, 'verify']);

    // Document Management (UC-04, UC-06) - CRUD operations
    Route::apiResource('documents', DocumentController::class);
});

// Legacy route (can be removed later)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
