<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentDeleteTest extends TestCase
{
    use RefreshDatabase;

    protected User $manager;
    protected User $uploader;
    protected User $uploader2;
    protected User $qc;
    protected User $sbap;

    protected function setUp(): void
    {
        parent::setUp();

        // Fake storage
        Storage::fake('local');

        // Create test users
        $this->manager = User::factory()->create(['role' => 'manager']);
        $this->uploader = User::factory()->create(['role' => 'uploader']);
        $this->uploader2 = User::factory()->create(['role' => 'uploader']);
        $this->qc = User::factory()->create(['role' => 'qc']);
        $this->sbap = User::factory()->create(['role' => 'sbap']);
    }

    /** @test */
    public function manager_can_delete_rejected_document()
    {
        $this->actingAs($this->manager);

        $document = Document::factory()->rejected()->create([
            'file_path' => 'archives/test.pdf',
        ]);

        // Create fake file
        Storage::put($document->file_path, 'fake file content');

        $response = $this->deleteJson("/api/documents/{$document->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Dokumen berhasil dihapus.',
            ]);

        // Verify document deleted from database
        $this->assertDatabaseMissing('documents', [
            'id' => $document->id,
        ]);

        // Verify file deleted from storage
        Storage::assertMissing($document->file_path);
    }

    /** @test */
    public function uploader_can_delete_own_rejected_document()
    {
        $this->actingAs($this->uploader);

        $document = Document::factory()->rejected()->create([
            'uploaded_by' => $this->uploader->id,
            'file_path' => 'archives/test.pdf',
        ]);

        Storage::put($document->file_path, 'fake file content');

        $response = $this->deleteJson("/api/documents/{$document->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('documents', [
            'id' => $document->id,
        ]);

        Storage::assertMissing($document->file_path);
    }

    /** @test */
    public function uploader_cannot_delete_others_rejected_document()
    {
        $this->actingAs($this->uploader);

        $document = Document::factory()->rejected()->create([
            'uploaded_by' => $this->uploader2->id,
        ]);

        $response = $this->deleteJson("/api/documents/{$document->id}");

        $response->assertStatus(403);

        // Document should still exist
        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
        ]);
    }

    /** @test */
    public function qc_cannot_delete_document()
    {
        $this->actingAs($this->qc);

        $document = Document::factory()->rejected()->create();

        $response = $this->deleteJson("/api/documents/{$document->id}");

        $response->assertStatus(403);

        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
        ]);
    }

    /** @test */
    public function sbap_cannot_delete_document()
    {
        $this->actingAs($this->sbap);

        $document = Document::factory()->rejected()->create();

        $response = $this->deleteJson("/api/documents/{$document->id}");

        $response->assertStatus(403);

        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
        ]);
    }

    /** @test */
    public function cannot_delete_pending_document()
    {
        $this->actingAs($this->manager);

        $document = Document::factory()->pending()->create();

        $response = $this->deleteJson("/api/documents/{$document->id}");

        $response->assertStatus(403);

        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
        ]);
    }

    /** @test */
    public function cannot_delete_verified_document()
    {
        $this->actingAs($this->manager);

        $document = Document::factory()->verified()->create();

        $response = $this->deleteJson("/api/documents/{$document->id}");

        $response->assertStatus(403);

        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
        ]);
    }

    /** @test */
    public function audit_log_recorded_for_delete()
    {
        $this->actingAs($this->manager);

        $document = Document::factory()->rejected()->create([
            'file_path' => 'archives/test.pdf',
            'file_name' => 'test.pdf',
        ]);

        Storage::put($document->file_path, 'fake file content');

        $this->deleteJson("/api/documents/{$document->id}");

        // Verify audit log exists
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->manager->id,
            'action' => 'delete_document',
        ]);

        $auditLog = AuditLog::where('action', 'delete_document')->first();
        $this->assertNotNull($auditLog);
        $this->assertEquals($document->id, $auditLog->metadata['document_id']);
        $this->assertEquals('test.pdf', $auditLog->metadata['file_name']);
    }

    /** @test */
    public function delete_removes_physical_file()
    {
        $this->actingAs($this->manager);

        $document = Document::factory()->rejected()->create([
            'file_path' => 'archives/nilai/2026/01/test.pdf',
        ]);

        // Create fake file
        Storage::put($document->file_path, 'PDF file content here');
        Storage::assertExists($document->file_path);

        $this->deleteJson("/api/documents/{$document->id}");

        // File should be deleted
        Storage::assertMissing($document->file_path);
    }

    /** @test */
    public function unauthenticated_user_cannot_delete()
    {
        $document = Document::factory()->rejected()->create();

        $response = $this->deleteJson("/api/documents/{$document->id}");

        $response->assertStatus(401);

        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
        ]);
    }
}
