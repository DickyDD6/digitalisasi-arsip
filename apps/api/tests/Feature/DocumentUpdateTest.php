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

    /** @test */
    public function uploader_can_update_own_rejected_document()
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
            'prodi' => 'Sistem Informasi',
            'tahun_ajaran' => '2024/2025',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Dokumen berhasil diperbarui. Status direset ke menunggu verifikasi.',
                'data' => [
                    'prodi' => 'Sistem Informasi',
                    'tahun_ajaran' => '2024/2025',
                    'status' => 'menunggu_verifikasi',
                ],
            ]);

        // Verify database
        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
            'prodi' => 'Sistem Informasi',
            'tahun_ajaran' => '2024/2025',
            'status' => 'menunggu_verifikasi',
        ]);
    }

    /** @test */
    public function uploader_cannot_update_others_rejected_document()
    {
        $this->actingAs($this->uploader);

        // Create rejected document owned by uploader2
        $document = Document::factory()->rejected()->create([
            'uploaded_by' => $this->uploader2->id,
        ]);

        $response = $this->putJson("/api/documents/{$document->id}", [
            'prodi' => 'Sistem Informasi',
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function uploader_cannot_update_pending_document()
    {
        $this->actingAs($this->uploader);

        // Create pending document owned by uploader
        $document = Document::factory()->pending()->create([
            'uploaded_by' => $this->uploader->id,
        ]);

        $response = $this->putJson("/api/documents/{$document->id}", [
            'prodi' => 'Sistem Informasi',
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function uploader_cannot_update_verified_document()
    {
        $this->actingAs($this->uploader);

        // Create verified document owned by uploader
        $document = Document::factory()->verified()->create([
            'uploaded_by' => $this->uploader->id,
        ]);

        $response = $this->putJson("/api/documents/{$document->id}", [
            'prodi' => 'Sistem Informasi',
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function manager_can_update_any_document()
    {
        $this->actingAs($this->manager);

        // Create verified document (not owned by manager)
        $document = Document::factory()->verified()->create([
            'uploaded_by' => $this->uploader->id,
            'prodi' => 'Teknik Informatika',
        ]);

        $response = $this->putJson("/api/documents/{$document->id}", [
            'prodi' => 'Sistem Informasi',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
            'prodi' => 'Sistem Informasi',
        ]);
    }

    /** @test */
    public function update_resets_status_to_pending()
    {
        $this->actingAs($this->uploader);

        $document = Document::factory()->rejected()->create([
            'uploaded_by' => $this->uploader->id,
            'status' => 'tidak_terverifikasi',
        ]);

        $this->putJson("/api/documents/{$document->id}", [
            'prodi' => 'Sistem Informasi',
        ]);

        $document->refresh();
        $this->assertEquals('menunggu_verifikasi', $document->status);
    }

    /** @test */
    public function update_clears_verification_data()
    {
        $this->actingAs($this->uploader);

        $document = Document::factory()->rejected()->create([
            'uploaded_by' => $this->uploader->id,
            'verified_by' => $this->qc->id,
            'verified_at' => now(),
            'verification_note' => 'Some note',
        ]);

        $this->putJson("/api/documents/{$document->id}", [
            'prodi' => 'Sistem Informasi',
        ]);

        $document->refresh();
        $this->assertNull($document->verified_by);
        $this->assertNull($document->verified_at);
        $this->assertNull($document->verification_note);
    }

    /** @test */
    public function cannot_update_file()
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

    /** @test */
    public function cannot_update_document_type()
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
    public function duplicate_check_on_update()
    {
        $this->actingAs($this->uploader);

        // Create first document
        Document::factory()->pending()->create([
            'document_type' => 'nilai',
            'prodi' => 'Teknik Informatika',
            'tahun_ajaran' => '2024/2025',
            'mata_kuliah' => 'Database',
            'kelas' => 'A',
        ]);

        // Create second document
        $document = Document::factory()->rejected()->create([
            'uploaded_by' => $this->uploader->id,
            'document_type' => 'nilai',
            'prodi' => 'Sistem Informasi',
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

    /** @test */
    public function audit_log_recorded_for_update()
    {
        $this->actingAs($this->uploader);

        $document = Document::factory()->rejected()->create([
            'uploaded_by' => $this->uploader->id,
        ]);

        $this->putJson("/api/documents/{$document->id}", [
            'prodi' => 'Sistem Informasi',
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

    /** @test */
    public function validation_fails_for_invalid_metadata()
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
