<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// CSRF Cookie endpoint for Sanctum Stateful API
// Frontend MUST call this before login to get CSRF token
Route::get('/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set.']);
})->name('sanctum.csrf-cookie');

// Authentication routes
Route::post('/auth/login', [AuthController::class, 'login'])
    ->middleware(['throttle:75,1', 'throttle.login.attempts'])  // IP: 75/min, Account: role-based
    ->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // User Management (UC-01) - Only accessible by manager
    Route::apiResource('users', UserController::class);

    // Audit Log / Activity Monitoring (UC-03) - Only accessible by manager
    Route::get('/audit-logs', [AuditLogController::class, 'index']);
    Route::get('/audit-logs/statistics', [AuditLogController::class, 'statistics']);
    Route::get('/audit-logs/export', [AuditLogController::class, 'export']);


    // Document Verification (UC-08) - QC & Manager only
    // IMPORTANT: These must be BEFORE apiResource to prevent route collision
    Route::get('/documents/pending', [DocumentController::class, 'pending']);
    Route::patch('/documents/{document}/verify', [DocumentController::class, 'verify']);

    // Document Download (UC-10) - Manager & SBAP only
    Route::get('/documents/{document}/download', [DocumentController::class, 'download']);
    Route::get('/documents/{document}/view', [DocumentController::class, 'view']);

    // Document Management (UC-04, UC-06, UC-07) - CRUD operations
    Route::apiResource('documents', DocumentController::class);
});
