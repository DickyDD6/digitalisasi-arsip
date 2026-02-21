<?php

namespace Tests\Feature;

use App\Enums\AuditAction;
use App\Enums\ModelType;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuditLogExportTest extends TestCase
{
    use RefreshDatabase;

    public function test_manager_can_export_audit_logs()
    {
        // Arrange
        $manager = User::factory()->create(['role' => 'manager']);

        // Create some audit logs
        AuditLog::create([
            'user_id' => $manager->id,
            'action' => AuditAction::LOGIN->value,
            'description' => 'User logged in',
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Test Agent',
        ]);

        AuditLog::create([
            'user_id' => $manager->id,
            'action' => AuditAction::UPLOAD_DOCUMENT->value,
            'model_type' => ModelType::DOCUMENT->value,
            'model_id' => 123,
            'description' => 'Document uploaded',
            'metadata' => ['file_name' => 'test.pdf'],
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Test Agent',
        ]);

        // Act
        $response = $this->actingAs($manager)->getJson('/api/audit-logs/export');

        // Assert
        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/csv; charset=utf-8');
        $response->assertHeader('Content-Disposition', 'attachment; filename=audit_logs_' . date('Y-m-d_H-i') . '.csv');

        // Verify CSV content
        $content = $response->streamedContent();

        // Split content by lines
        $lines = explode("\n", trim($content));

        // Assert header row (accounting for BOM and potential quoting)
        $this->assertStringContainsString('No,User,Role,Aksi', $lines[0]);
        $this->assertStringContainsString('ID Dokumen', $lines[0]);
        $this->assertStringContainsString('Nama Dokumen', $lines[0]);
        $this->assertStringContainsString('Waktu,Tanggal,Deskripsi', $lines[0]);

        // Assert data rows
        // Note: The order created_at desc means upload (latest) first, then login

        // Upload row
        $this->assertStringContainsString('Unggah', $content);
        $this->assertStringContainsString('test.pdf', $content);
        $this->assertStringContainsString('DOC-123', $content);

        // Login row
        $this->assertStringContainsString('Masuk', $content);
    }

    public function test_non_manager_cannot_export_audit_logs()
    {
        $user = User::factory()->create(['role' => 'uploader']);

        $response = $this->actingAs($user)->getJson('/api/audit-logs/export');

        $response->assertStatus(403);
    }
}
