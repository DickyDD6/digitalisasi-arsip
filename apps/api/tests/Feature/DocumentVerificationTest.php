<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DocumentVerificationTest extends TestCase
{
    use RefreshDatabase;

    protected User $manager;
    protected User $uploader;
    protected User $qc;
    protected User $sbap;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test users
        $this->manager = User::factory()->create(['role' => 'manager']);
        $this->uploader = User::factory()->create(['role' => 'uploader']);
        $this->qc = User::factory()->create(['role' => 'qc']);
        $this->sbap = User::factory()->create(['role' => 'sbap']);
    }

    /** @test */
    public function qc_can_view_pending_documents()
    {
        $this->actingAs($this->qc);

        // Create pending documents
        Document::factory()->pending()->count(3)->create();

        $response = $this->getJson('/api/documents/pending');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'data' => [
                    '*' => ['id', 'document_type', 'status'],
                ],
                'meta',
            ])
            ->assertJson([
                'message' => 'Daftar dokumen menunggu verifikasi.',
            ]);
    }

    /** @test */
    public function manager_can_view_pending_documents()
    {
        $this->actingAs($this->manager);

        Document::factory()->pending()->count(2)->create();

        $response = $this->getJson('/api/documents/pending');

        $response->assertStatus(200);
    }

    /** @test */
    public function uploader_cannot_view_pending_documents()
    {
        $this->actingAs($this->uploader);

        $response = $this->getJson('/api/documents/pending');

        $response->assertStatus(403);
    }

    /** @test */
    public function sbap_cannot_view_pending_documents()
    {
        $this->actingAs($this->sbap);

        $response = $this->getJson('/api/documents/pending');

        $response->assertStatus(403);
    }

    /** @test */
    public function qc_can_verify_document()
    {
        $this->actingAs($this->qc);

        $document = Document::factory()->pending()->create();

        $response = $this->patchJson("/api/documents/{$document->id}/verify", [
            'status' => 'terverifikasi',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Dokumen berhasil diverifikasi.',
                'data' => [
                    'status' => 'terverifikasi',
                ],
            ]);

        // Verify database updated
        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
            'status' => 'terverifikasi',
            'verified_by' => $this->qc->id,
        ]);

        $document->refresh();
        $this->assertNotNull($document->verified_at);
    }

    /** @test */
    public function qc_can_reject_document_with_note()
    {
        $this->actingAs($this->qc);

        $document = Document::factory()->pending()->create();

        $response = $this->patchJson("/api/documents/{$document->id}/verify", [
            'status' => 'tidak_terverifikasi',
            'verification_note' => 'Format dokumen tidak sesuai standar.',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Dokumen ditolak.',
                'data' => [
                    'status' => 'tidak_terverifikasi',
                    'verification_note' => 'Format dokumen tidak sesuai standar.',
                ],
            ]);

        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
            'status' => 'tidak_terverifikasi',
            'verification_note' => 'Format dokumen tidak sesuai standar.',
            'verified_by' => $this->qc->id,
        ]);
    }

    /** @test */
    public function manager_can_verify_document()
    {
        $this->actingAs($this->manager);

        $document = Document::factory()->pending()->create();

        $response = $this->patchJson("/api/documents/{$document->id}/verify", [
            'status' => 'terverifikasi',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
            'status' => 'terverifikasi',
            'verified_by' => $this->manager->id,
        ]);
    }

    /** @test */
    public function uploader_cannot_verify_document()
    {
        $this->actingAs($this->uploader);

        $document = Document::factory()->pending()->create();

        $response = $this->patchJson("/api/documents/{$document->id}/verify", [
            'status' => 'terverifikasi',
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function sbap_cannot_verify_document()
    {
        $this->actingAs($this->sbap);

        $document = Document::factory()->pending()->create();

        $response = $this->patchJson("/api/documents/{$document->id}/verify", [
            'status' => 'terverifikasi',
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function cannot_verify_already_verified_document()
    {
        $this->actingAs($this->qc);

        // Create already verified document
        $document = Document::factory()->verified()->create();

        $response = $this->patchJson("/api/documents/{$document->id}/verify", [
            'status' => 'terverifikasi',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['document']);
    }

    /** @test */
    public function cannot_verify_already_rejected_document()
    {
        $this->actingAs($this->qc);

        // Create already rejected document
        $document = Document::factory()->rejected()->create();

        $response = $this->patchJson("/api/documents/{$document->id}/verify", [
            'status' => 'tidak_terverifikasi',
            'verification_note' => 'Another reason',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['document']);
    }

    /** @test */
    public function audit_log_recorded_for_verify_action()
    {
        $this->actingAs($this->qc);

        $document = Document::factory()->pending()->create();

        $this->patchJson("/api/documents/{$document->id}/verify", [
            'status' => 'terverifikasi',
        ]);

        // Verify audit log exists
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->qc->id,
            'action' => 'verify_document',
        ]);

        $auditLog = AuditLog::where('action', 'verify_document')->first();
        $this->assertNotNull($auditLog);
        $this->assertEquals($document->id, $auditLog->metadata['document_id']);
        $this->assertEquals('terverifikasi', $auditLog->metadata['status']);
    }

    /** @test */
    public function audit_log_recorded_for_reject_action()
    {
        $this->actingAs($this->qc);

        $document = Document::factory()->pending()->create();

        $this->patchJson("/api/documents/{$document->id}/verify", [
            'status' => 'tidak_terverifikasi',
            'verification_note' => 'Dokumen tidak lengkap',
        ]);

        // Verify audit log exists
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->qc->id,
            'action' => 'reject_document',
        ]);

        $auditLog = AuditLog::where('action', 'reject_document')->first();
        $this->assertNotNull($auditLog);
        $this->assertEquals($document->id, $auditLog->metadata['document_id']);
        $this->assertEquals('tidak_terverifikasi', $auditLog->metadata['status']);
        $this->assertEquals('Dokumen tidak lengkap', $auditLog->metadata['verification_note']);
    }

    /** @test */
    public function validation_fails_if_status_is_invalid()
    {
        $this->actingAs($this->qc);

        $document = Document::factory()->pending()->create();

        $response = $this->patchJson("/api/documents/{$document->id}/verify", [
            'status' => 'invalid_status',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    /** @test */
    public function validation_fails_if_status_is_missing()
    {
        $this->actingAs($this->qc);

        $document = Document::factory()->pending()->create();

        $response = $this->patchJson("/api/documents/{$document->id}/verify", [
            'verification_note' => 'Some note',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    /** @test */
    public function pending_documents_ordered_by_oldest_first()
    {
        $this->actingAs($this->qc);

        // Create documents with different timestamps
        $old = Document::factory()->pending()->create(['created_at' => now()->subDays(3)]);
        $newest = Document::factory()->pending()->create(['created_at' => now()]);
        $middle = Document::factory()->pending()->create(['created_at' => now()->subDays(1)]);

        $response = $this->getJson('/api/documents/pending');

        $response->assertStatus(200);

        // Verify order is oldest first
        $data = $response->json('data');
        $this->assertEquals($old->id, $data[0]['id']);
        $this->assertEquals($middle->id, $data[1]['id']);
        $this->assertEquals($newest->id, $data[2]['id']);
    }
}
