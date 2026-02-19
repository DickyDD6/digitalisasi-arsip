<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DocumentUpdateTest extends TestCase
{
    use RefreshDatabase;

    protected User $manager;
    protected User $uploader;
    protected User $uploader2;
    protected User $qc;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test users
        $this->manager = User::factory()->create(['role' => 'manager']);
        $this->uploader = User::factory()->create(['role' => 'uploader']);
        $this->uploader2 = User::factory()->create(['role' => 'uploader']);
        $this->qc = User::factory()->create(['role' => 'qc']);
    }

    public function test_uploader_can_update_own_rejected_document()
    {
        $this->actingAs($this->uploader);

        // Create rejected document owned by uploader
        $document = Document::factory()->rejected()->create([
            'uploaded_by' => $this->uploader->id,
            'document_type' => 'nilai',
            'prodi' => 'Teknik Informatika',
            'tahun_ajaran' => '2023/2024',
        ]);

        $response = $this->putJson("/api/documents/{$document->id}", [
            'prodi' => 'Teknologi Pangan',
            'tahun_ajaran' => '2024/2025',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Dokumen berhasil diperbarui. Status direset ke menunggu verifikasi.',
                'data' => [
                    'prodi' => 'Teknologi Pangan',
                    'tahun_ajaran' => '2024/2025',
                    'status' => 'Menunggu Verifikasi',
                ],
            ]);

        // Verify database
        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
            'prodi' => 'Teknologi Pangan',
            'tahun_ajaran' => '2024/2025',
            'status' => 'menunggu verifikasi',
        ]);
    }

    public function test_uploader_cannot_update_others_rejected_document()
    {
        $this->actingAs($this->uploader);

        // Create rejected document owned by uploader2
        $document = Document::factory()->rejected()->create([
            'uploaded_by' => $this->uploader2->id,
        ]);

        $response = $this->putJson("/api/documents/{$document->id}", [
            'prodi' => 'Teknologi Pangan',
        ]);

        $response->assertStatus(403);
    }

    public function test_uploader_cannot_update_pending_document()
    {
        $this->actingAs($this->uploader);

        // Create pending document owned by uploader
        $document = Document::factory()->pending()->create([
            'uploaded_by' => $this->uploader->id,
        ]);

        $response = $this->putJson("/api/documents/{$document->id}", [
            'prodi' => 'Teknologi Pangan',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['document']);
    }

    public function test_uploader_cannot_update_verified_document()
    {
        $this->actingAs($this->uploader);

        // Create verified document owned by uploader
        $document = Document::factory()->verified()->create([
            'uploaded_by' => $this->uploader->id,
        ]);

        $response = $this->putJson("/api/documents/{$document->id}", [
            'prodi' => 'Teknologi Pangan',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['document']);
    }

    public function test_manager_can_update_any_document()
    {
        $this->actingAs($this->manager);

        // Create verified document (not owned by manager)
        $document = Document::factory()->verified()->create([
            'uploaded_by' => $this->uploader->id,
            'prodi' => 'Teknik Informatika',
        ]);

        $response = $this->putJson("/api/documents/{$document->id}", [
            'prodi' => 'Teknologi Pangan',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
            'prodi' => 'Teknologi Pangan',
        ]);
    }

    public function test_update_resets_status_to_pending()
    {
        $this->actingAs($this->uploader);

        $document = Document::factory()->rejected()->create([
            'uploaded_by' => $this->uploader->id,
            'status' => 'tidak terverifikasi',
        ]);

        $this->putJson("/api/documents/{$document->id}", [
            'prodi' => 'Teknologi Pangan',
        ]);

        $document->refresh();
        $document->refresh();
        $this->assertEquals('menunggu verifikasi', $document->status->value);
    }

    public function test_update_clears_verification_data()
    {
        $this->actingAs($this->uploader);

        $document = Document::factory()->rejected()->create([
            'uploaded_by' => $this->uploader->id,
            'verified_by' => $this->qc->id,
            'verified_at' => now(),
            'verification_note' => 'Some note',
        ]);

        $this->putJson("/api/documents/{$document->id}", [
            'prodi' => 'Teknologi Pangan',
        ]);

        $document->refresh();
        $this->assertNull($document->verified_by);
        $this->assertNull($document->verified_at);
        $this->assertNull($document->verification_note);
    }

    public function test_cannot_update_file()
    {
        $this->actingAs($this->uploader);

        $document = Document::factory()->rejected()->create([
            'uploaded_by' => $this->uploader->id,
        ]);

        $response = $this->putJson("/api/documents/{$document->id}", [
            'file' => 'some_file_data',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    public function test_cannot_update_document_type()
    {
        $this->actingAs($this->uploader);

        $document = Document::factory()->rejected()->create([
            'uploaded_by' => $this->uploader->id,
            'document_type' => 'nilai',
        ]);

        $response = $this->putJson("/api/documents/{$document->id}", [
            'document_type' => 'ijazah',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['document_type']);
    }

    /** @test */
    public function test_duplicate_check_on_update()
    {
        $this->actingAs($this->uploader);

        // Create first document
        $doc1Data = [
            'document_type' => 'nilai',
            'prodi' => 'Teknik Informatika',
            'tahun_ajaran' => '2024/2025',
            'mata_kuliah' => 'Database',
            'kelas' => 'A',
            'uploaded_by' => $this->uploader->id,
            'status' => 'menunggu verifikasi',
        ];
        $doc1Data['duplicate_key'] = Document::generateDuplicateKey($doc1Data);
        Document::factory()->create($doc1Data);

        // Create second document
        $document = Document::factory()->rejected()->create([
            'uploaded_by' => $this->uploader->id,
            'document_type' => 'nilai',
            'prodi' => 'Teknologi Pangan',
            'tahun_ajaran' => '2023/2024',
            'mata_kuliah' => 'Web',
            'kelas' => 'B',
        ]);

        // Try to update to match first document
        $response = $this->putJson("/api/documents/{$document->id}", [
            'prodi' => 'Teknik Informatika',
            'tahun_ajaran' => '2024/2025',
            'mata_kuliah' => 'Database',
            'kelas' => 'A',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['duplicate']);
    }

    public function test_audit_log_recorded_for_update()
    {
        $this->actingAs($this->uploader);

        $document = Document::factory()->rejected()->create([
            'uploaded_by' => $this->uploader->id,
        ]);

        $this->putJson("/api/documents/{$document->id}", [
            'prodi' => 'Teknologi Pangan',
        ]);

        // Verify audit log exists
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->uploader->id,
            'action' => 'update_document',
        ]);

        $auditLog = AuditLog::where('action', 'update_document')->first();
        $this->assertNotNull($auditLog);
        $this->assertEquals($document->id, $auditLog->metadata['document_id']);
        $this->assertArrayHasKey('updated_fields', $auditLog->metadata);
    }

    public function test_validation_fails_for_invalid_metadata()
    {
        $this->actingAs($this->uploader);

        $document = Document::factory()->rejected()->create([
            'uploaded_by' => $this->uploader->id,
        ]);

        $response = $this->putJson("/api/documents/{$document->id}", [
            'prodi' => str_repeat('a', 300), // Exceeds max length
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['prodi']);
    }
}
