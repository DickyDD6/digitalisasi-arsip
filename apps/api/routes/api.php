<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authentication routes (public)
Route::post('/auth/login', [AuthController::class, 'login'])
    ->middleware(['throttle:75,1', 'throttle.login.attempts'])
    ->name('login');

Route::post('/auth/check-email', [AuthController::class, 'checkEmail']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/logout-all', [AuthController::class, 'logoutAll']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // User Management (UC-01) - Only accessible by manager
    Route::get('/users/statistics', [UserController::class, 'statistics']);
    Route::apiResource('users', UserController::class);
    Route::post('/users/delete-multiple', [UserController::class, 'destroyMultiple']);

    // Audit Log / Activity Monitoring (UC-03) - Only accessible by manager
    Route::get('/audit-logs', [AuditLogController::class, 'index']);
    Route::get('/audit-logs/statistics', [AuditLogController::class, 'statistics']);
    Route::get('/audit-logs/export', [AuditLogController::class, 'export']);


    // Document Verification (UC-08) - QC & Manager only
    // IMPORTANT: These must be BEFORE apiResource to prevent route collision
    Route::get('/documents/statistics', [DocumentController::class, 'statistics']);
    Route::get('/documents/pending', [DocumentController::class, 'pending']);
    Route::patch('/documents/{document}/verify', [DocumentController::class, 'verify']);

    // Document Download (UC-10) - Manager & SBAP only
    Route::get('/documents/{document}/download', [DocumentController::class, 'download']);
    Route::post('/documents/download-multiple', [DocumentController::class, 'downloadMultiple']);
    Route::post('/documents/delete-multiple', [DocumentController::class, 'destroyMultiple']);
    Route::get('/documents/{document}/view', [DocumentController::class, 'view']);

    // Document Management (UC-04, UC-06, UC-07) - CRUD operations
    Route::apiResource('documents', DocumentController::class);

    // Report & Statistics (UC-09) - Manager
    Route::post('/reports/generate', [App\Http\Controllers\ReportController::class, 'generate']);
    Route::get('/reports/dashboard', [App\Http\Controllers\ReportController::class, 'dashboardStats']);
});
