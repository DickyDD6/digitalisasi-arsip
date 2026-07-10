<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

/**
 * Reusable OpenAPI Schema Definitions.
 *
 * File ini berisi semua schema yang digunakan secara berulang
 * di berbagai endpoint (request bodies, responses, dll).
 */

// ============================================================
// Common Responses
// ============================================================

#[OA\Schema(
    schema: 'ValidationError',
    type: 'object',
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'The email field is invalid.'),
        new OA\Property(
            property: 'errors',
            type: 'object',
            description: 'Object berisi field yang error dengan array pesan error',
            additionalProperties: new OA\AdditionalProperties(
                type: 'array',
                items: new OA\Items(type: 'string')
            )
        ),
    ]
)]

#[OA\Schema(
    schema: 'ErrorResponse',
    type: 'object',
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'This action is unauthorized.'),
    ]
)]

#[OA\Schema(
    schema: 'PaginationMeta',
    type: 'object',
    properties: [
        new OA\Property(property: 'current_page', type: 'integer', example: 1),
        new OA\Property(property: 'last_page', type: 'integer', example: 5),
        new OA\Property(property: 'per_page', type: 'integer', example: 15),
        new OA\Property(property: 'total', type: 'integer', example: 72),
    ]
)]

// ============================================================
// Auth Schemas
// ============================================================

#[OA\Schema(
    schema: 'LoginRequest',
    required: ['email', 'password'],
    type: 'object',
    properties: [
        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'manager@test.com'),
        new OA\Property(property: 'password', type: 'string', format: 'password', example: 'password'),
    ]
)]

#[OA\Schema(
    schema: 'LoginResponse',
    type: 'object',
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Login berhasil.'),
        new OA\Property(
            property: 'data',
            type: 'object',
            properties: [
                new OA\Property(property: 'user', ref: '#/components/schemas/User'),
            ]
        ),
    ]
)]

// ============================================================
// User Schemas
// ============================================================

#[OA\Schema(
    schema: 'User',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'name', type: 'string', example: 'Manager'),
        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'manager@test.com'),
        new OA\Property(property: 'nip', type: 'string', nullable: true, example: '1234567890'),
        new OA\Property(property: 'role', type: 'string', enum: ['manager', 'uploader', 'qc', 'sbap'], example: 'manager'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time', example: '2026-01-14T04:00:00.000000Z'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time', example: '2026-01-14T04:00:00.000000Z'),
    ]
)]

#[OA\Schema(
    schema: 'UserResponse',
    type: 'object',
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Detail pengguna berhasil diambil.'),
        new OA\Property(property: 'data', ref: '#/components/schemas/User'),
    ]
)]

#[OA\Schema(
    schema: 'UserListResponse',
    type: 'object',
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Daftar pengguna berhasil diambil.'),
        new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/User')),
        new OA\Property(property: 'meta', ref: '#/components/schemas/PaginationMeta'),
    ]
)]

#[OA\Schema(
    schema: 'CreateUserRequest',
    required: ['name', 'email', 'password', 'role'],
    type: 'object',
    properties: [
        new OA\Property(property: 'name', type: 'string', maxLength: 255, example: 'Uploader Baru'),
        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'uploader_baru@test.com'),
        new OA\Property(property: 'nip', type: 'string', maxLength: 50, nullable: true, example: '1234567890'),
        new OA\Property(property: 'password', type: 'string', minLength: 8, example: 'password123'),
        new OA\Property(property: 'role', type: 'string', enum: ['manager', 'uploader', 'qc', 'sbap'], example: 'uploader'),
    ]
)]

#[OA\Schema(
    schema: 'UpdateUserRequest',
    type: 'object',
    description: 'Semua field bersifat optional untuk mendukung partial update. Hanya kirim field yang ingin diubah.',
    properties: [
        new OA\Property(property: 'name', type: 'string', maxLength: 255, example: 'Uploader Baru - Updated'),
        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'uploader_updated@test.com'),
        new OA\Property(property: 'nip', type: 'string', maxLength: 50, nullable: true, example: '0987654321'),
        new OA\Property(property: 'password', type: 'string', minLength: 8, example: 'newpassword123'),
        new OA\Property(property: 'role', type: 'string', enum: ['manager', 'uploader', 'qc', 'sbap'], example: 'qc'),
    ]
)]

#[OA\Schema(
    schema: 'UserStatisticsResponse',
    type: 'object',
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Statistik pengguna berhasil diambil.'),
        new OA\Property(
            property: 'data',
            type: 'object',
            properties: [
                new OA\Property(property: 'total_users', type: 'integer', example: 25),
                new OA\Property(property: 'active_users', type: 'integer', description: 'Users yang memiliki aktivitas dalam 30 hari terakhir', example: 18),
                new OA\Property(property: 'new_users', type: 'integer', description: 'Users yang dibuat dalam 30 hari terakhir', example: 5),
            ]
        ),
    ]
)]

// ============================================================
// Document Schemas
// ============================================================

#[OA\Schema(
    schema: 'Document',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'document_type', type: 'string', enum: ['nilai', 'transkrip', 'ijazah', 'berita_acara_sidang'], example: 'nilai'),
        new OA\Property(property: 'file_name', type: 'string', example: 'nilai_pemrograman_web_2024.pdf'),
        new OA\Property(property: 'file_size', type: 'integer', description: 'Ukuran file dalam bytes', example: 102400),
        new OA\Property(property: 'file_size_formatted', type: 'string', description: 'Ukuran file dalam format human-readable', example: '100 KB'),
        new OA\Property(property: 'prodi', type: 'string', example: 'Teknik Informatika'),
        new OA\Property(property: 'tahun_ajaran', type: 'string', nullable: true, description: 'Wajib untuk dokumen nilai', example: '2024/2025'),
        new OA\Property(property: 'mata_kuliah', type: 'string', nullable: true, description: 'Wajib untuk dokumen nilai', example: 'Pemrograman Web'),
        new OA\Property(property: 'kelas', type: 'string', nullable: true, description: 'Wajib untuk dokumen nilai', example: 'A'),
        new OA\Property(property: 'tahun_lulus', type: 'string', nullable: true, description: 'Wajib untuk dokumen ijazah/transkrip', example: '2024'),
        new OA\Property(property: 'npm', type: 'string', nullable: true, description: 'Wajib untuk dokumen ijazah/transkrip', example: '1234567890'),
        new OA\Property(property: 'status', type: 'string', description: 'Status dokumen (Title Case)', example: 'Menunggu Verifikasi'),
        new OA\Property(property: 'verification_note', type: 'string', nullable: true, example: null),
        new OA\Property(property: 'uploaded_by_name', type: 'string', description: 'Nama user yang mengupload', example: 'Uploader User'),
        new OA\Property(property: 'verified_by_name', type: 'string', nullable: true, description: 'Nama user yang memverifikasi', example: 'QC User'),
        new OA\Property(property: 'verified_at', type: 'string', format: 'date-time', nullable: true, example: null),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time', example: '2026-01-14T04:00:00.000000Z'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time', example: '2026-01-14T04:00:00.000000Z'),
    ]
)]

#[OA\Schema(
    schema: 'DocumentResponse',
    type: 'object',
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Detail dokumen berhasil diambil.'),
        new OA\Property(property: 'data', ref: '#/components/schemas/Document'),
    ]
)]

#[OA\Schema(
    schema: 'DocumentListResponse',
    type: 'object',
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Daftar dokumen berhasil diambil.'),
        new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Document')),
        new OA\Property(property: 'meta', ref: '#/components/schemas/PaginationMeta'),
    ]
)]

#[OA\Schema(
    schema: 'DocumentStatisticsResponse',
    type: 'object',
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Statistik dokumen berhasil diambil.'),
        new OA\Property(
            property: 'data',
            type: 'object',
            properties: [
                new OA\Property(property: 'total_documents', type: 'integer', example: 150),
                new OA\Property(property: 'verified_documents', type: 'integer', example: 80),
                new OA\Property(property: 'pending_documents', type: 'integer', example: 50),
                new OA\Property(property: 'rejected_documents', type: 'integer', example: 20),
            ]
        ),
    ]
)]

#[OA\Schema(
    schema: 'UploadDocumentRequest',
    required: ['document_type', 'prodi', 'file'],
    type: 'object',
    properties: [
        new OA\Property(property: 'document_type', type: 'string', enum: ['nilai', 'transkrip', 'ijazah', 'berita_acara_sidang'], description: 'Tipe dokumen', example: 'nilai'),
        new OA\Property(property: 'prodi', type: 'string', maxLength: 255, description: 'Program studi', example: 'Teknik Informatika'),
        new OA\Property(property: 'file', type: 'string', format: 'binary', description: 'File PDF (max 5MB)'),
        new OA\Property(property: 'tahun_ajaran', type: 'string', maxLength: 255, description: 'Wajib untuk dokumen nilai', example: '2024/2025'),
        new OA\Property(property: 'mata_kuliah', type: 'string', maxLength: 255, description: 'Wajib untuk dokumen nilai', example: 'Pemrograman Web'),
        new OA\Property(property: 'kelas', type: 'string', maxLength: 255, description: 'Wajib untuk dokumen nilai', example: 'A'),
        new OA\Property(property: 'tahun_lulus', type: 'string', maxLength: 255, description: 'Wajib untuk dokumen ijazah/transkrip/berita_acara_sidang', example: '2024'),
        new OA\Property(property: 'npm', type: 'string', maxLength: 255, description: 'Wajib untuk dokumen ijazah/transkrip/berita_acara_sidang', example: '1234567890'),
    ]
)]

#[OA\Schema(
    schema: 'UpdateDocumentRequest',
    type: 'object',
    properties: [
        new OA\Property(property: 'prodi', type: 'string', maxLength: 255, example: 'Sistem Informasi - Updated'),
        new OA\Property(property: 'tahun_ajaran', type: 'string', maxLength: 255, description: 'Untuk dokumen nilai', example: '2025/2026'),
        new OA\Property(property: 'mata_kuliah', type: 'string', maxLength: 255, description: 'Untuk dokumen nilai', example: 'Algoritma'),
        new OA\Property(property: 'kelas', type: 'string', maxLength: 255, description: 'Untuk dokumen nilai', example: 'B'),
        new OA\Property(property: 'tahun_lulus', type: 'string', maxLength: 255, description: 'Untuk dokumen ijazah/transkrip', example: '2025'),
        new OA\Property(property: 'npm', type: 'string', maxLength: 255, description: 'Untuk dokumen ijazah/transkrip', example: '0987654321'),
    ]
)]

#[OA\Schema(
    schema: 'VerifyDocumentRequest',
    required: ['status'],
    type: 'object',
    properties: [
        new OA\Property(property: 'status', type: 'string', enum: ['terverifikasi', 'tidak_terverifikasi'], description: 'Status verifikasi', example: 'terverifikasi'),
        new OA\Property(property: 'verification_note', type: 'string', maxLength: 500, nullable: true, description: 'Catatan verifikasi (opsional, disarankan jika ditolak)', example: 'Format dokumen tidak sesuai standar.'),
    ]
)]

#[OA\Schema(
    schema: 'DeleteMultipleRequest',
    required: ['ids'],
    type: 'object',
    properties: [
        new OA\Property(property: 'ids', type: 'array', description: 'Array of IDs to process', items: new OA\Items(type: 'integer'), example: [1, 2, 3]),
    ]
)]

// ============================================================
// Report Schemas
// ============================================================

#[OA\Schema(
    schema: 'ReportGenerateRequest',
    required: ['period_start', 'period_end', 'format', 'type'],
    type: 'object',
    properties: [
        new OA\Property(property: 'period_start', type: 'string', format: 'date', description: 'Tanggal awal periode laporan', example: '2026-01-01'),
        new OA\Property(property: 'period_end', type: 'string', format: 'date', description: 'Tanggal akhir periode laporan', example: '2026-01-31'),
        new OA\Property(property: 'format', type: 'string', enum: ['pdf', 'xlsx', 'csv'], description: 'Format file laporan', example: 'pdf'),
        new OA\Property(property: 'type', type: 'string', enum: ['monthly', 'annual', 'custom'], description: 'Tipe laporan', example: 'monthly'),
        new OA\Property(property: 'style', type: 'string', enum: ['detailed', 'summary', 'executive'], nullable: true, description: 'Gaya laporan (opsional)', example: 'detailed'),
        new OA\Property(
            property: 'content',
            type: 'array',
            description: 'Konten yang dimasukkan ke laporan (opsional)',
            items: new OA\Items(type: 'string', enum: ['upload_stats', 'qc_metrics', 'doc_status', 'user_activity', 'trend_analysis']),
            nullable: true,
            example: ['upload_stats', 'qc_metrics', 'doc_status']
        ),
    ]
)]

#[OA\Schema(
    schema: 'DashboardStatsResponse',
    type: 'object',
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Statistik dashboard berhasil diambil.'),
        new OA\Property(
            property: 'data',
            type: 'object',
            properties: [
                new OA\Property(property: 'total_reports_generated', type: 'integer', example: 0),
                new OA\Property(property: 'most_downloaded_type', type: 'string', example: 'Bulanan'),
                new OA\Property(property: 'last_generated', type: 'string', example: '2026-02-22 00:20'),
            ]
        ),
    ]
)]

// ============================================================
// Audit Log Schemas
// ============================================================

#[OA\Schema(
    schema: 'AuditLog',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(
            property: 'user',
            type: 'object',
            nullable: true,
            properties: [
                new OA\Property(property: 'id', type: 'integer', example: 2),
                new OA\Property(property: 'name', type: 'string', example: 'Tim Uploader'),
                new OA\Property(property: 'email', type: 'string', example: 'uploader@test.com'),
                new OA\Property(property: 'role', type: 'string', example: 'uploader'),
            ]
        ),
        new OA\Property(
            property: 'action',
            type: 'object',
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'upload_document'),
                new OA\Property(property: 'label', type: 'string', example: 'Upload Dokumen'),
                new OA\Property(property: 'color', type: 'string', example: 'primary'),
            ]
        ),
        new OA\Property(property: 'description', type: 'string', example: "Dokumen 'Nilai_DB_2024.pdf' diunggah."),
        new OA\Property(property: 'model_type', type: 'string', nullable: true, example: 'App\\Models\\Document'),
        new OA\Property(property: 'model_id', type: 'integer', nullable: true, example: 1),
        new OA\Property(
            property: 'document',
            type: 'object',
            nullable: true,
            properties: [
                new OA\Property(property: 'id_formatted', type: 'string', example: '#001'),
                new OA\Property(property: 'name', type: 'string', example: 'Nilai_DB.pdf'),
            ]
        ),
        new OA\Property(property: 'metadata', type: 'object', nullable: true),
        new OA\Property(property: 'ip_address', type: 'string', example: '127.0.0.1'),
        new OA\Property(property: 'user_agent', type: 'string', example: 'PostmanRuntime/7.32.1'),
        new OA\Property(
            property: 'date',
            type: 'object',
            properties: [
                new OA\Property(property: 'formatted', type: 'string', example: '19/02/2026'),
                new OA\Property(property: 'time', type: 'string', example: '10.30'),
                new OA\Property(property: 'timestamp', type: 'string', example: '2026-02-19T10:30:00.000000Z'),
            ]
        ),
    ]
)]

#[OA\Schema(
    schema: 'AuditLogListResponse',
    type: 'object',
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Log aktivitas berhasil diambil.'),
        new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/AuditLog')),
        new OA\Property(property: 'meta', ref: '#/components/schemas/PaginationMeta'),
    ]
)]

#[OA\Schema(
    schema: 'AuditLogStatisticsResponse',
    type: 'object',
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Statistik aktivitas berhasil diambil.'),
        new OA\Property(
            property: 'data',
            type: 'object',
            properties: [
                new OA\Property(property: 'total_activities', type: 'integer', example: 150),
                new OA\Property(property: 'today_total', type: 'integer', example: 12),
                new OA\Property(property: 'today_upload', type: 'integer', example: 5),
                new OA\Property(property: 'today_verify', type: 'integer', example: 3),
                new OA\Property(property: 'today_reject', type: 'integer', example: 1),
                new OA\Property(property: 'by_action', type: 'object'),
                new OA\Property(property: 'recent_activities', type: 'array', items: new OA\Items(ref: '#/components/schemas/AuditLog')),
            ]
        ),
        new OA\Property(
            property: 'period',
            type: 'object',
            properties: [
                new OA\Property(property: 'start_date', type: 'string', format: 'date-time'),
                new OA\Property(property: 'end_date', type: 'string', format: 'date-time'),
            ]
        ),
    ]
)]

class Schemas
{
    // This class serves as a container for OpenAPI schema definitions.
    // The schemas are defined via PHP attributes above the class.
    // No methods or properties needed.
}
