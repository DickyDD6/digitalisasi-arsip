<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentTypeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProdiController;
use App\Http\Controllers\SystemSettingController;
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
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Notifications API
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    // System Settings API
    Route::get('/system-settings', [SystemSettingController::class, 'index']);
    Route::put('/system-settings', [SystemSettingController::class, 'update']);

    // Master Data API
    Route::get('/prodis', [ProdiController::class, 'index']);
    Route::post('/prodis', [ProdiController::class, 'store']);
    Route::get('/document-types', [DocumentTypeController::class, 'index']);

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
    Route::get('/reports/qc-performance', [App\Http\Controllers\ReportController::class, 'qcPerformance']);
});
