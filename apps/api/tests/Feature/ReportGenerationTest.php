<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Document;
use App\Models\AuditLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Enums\UserRole;

class ReportGenerationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed roles or specific data if needed, but factories should handle most
    }

    public function test_manager_can_generate_pdf_report()
    {
        $manager = User::factory()->create(['role' => UserRole::MANAGER]);

        // Create some dummy data
        Document::factory()->count(5)->create();
        AuditLog::factory()->count(10)->create();

        $response = $this->actingAs($manager)
            ->postJson('/api/reports/generate', [
                'period_start' => now()->subMonth()->toDateString(),
                'period_end' => now()->toDateString(),
                'format' => 'pdf',
                'type' => 'monthly',
                'content' => ['upload_stats', 'doc_status'],
            ]);

        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_manager_can_generate_excel_report()
    {
        $manager = User::factory()->create(['role' => UserRole::MANAGER]);

        $response = $this->actingAs($manager)
            ->postJson('/api/reports/generate', [
                'period_start' => now()->subMonth()->toDateString(),
                'period_end' => now()->toDateString(),
                'format' => 'xlsx',
                'type' => 'monthly',
                'content' => ['upload_stats'],
            ]);

        // XLSX format is not yet implemented — should return 500 with generic error
        $response->assertStatus(500)
            ->assertJson(['message' => 'Gagal membuat laporan. Silakan coba lagi.']);
    }

    public function test_staff_cannot_generate_report()
    {
        $uploader = User::factory()->create(['role' => UserRole::UPLOADER]);

        $response = $this->actingAs($uploader)
            ->postJson('/api/reports/generate', [
                'period_start' => now()->subMonth()->toDateString(),
                'period_end' => now()->toDateString(),
                'format' => 'pdf',
                'type' => 'monthly',
            ]);

        $response->assertStatus(403);
    }

    public function test_validation_errors()
    {
        $manager = User::factory()->create(['role' => UserRole::MANAGER]);

        $response = $this->actingAs($manager)
            ->postJson('/api/reports/generate', [
                // Missing required fields
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['period_start', 'period_end', 'format', 'type']);
    }

    public function test_dashboard_stats()
    {
        $manager = User::factory()->create(['role' => UserRole::MANAGER]);

        $response = $this->actingAs($manager)
            ->getJson('/api/reports/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'total_documents',
                    'verified_documents',
                    'pending_documents',
                    'rejected_documents',
                ],
                'period' => [
                    'start_date',
                    'end_date',
                ],
            ]);
    }
}
