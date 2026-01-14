<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentUploadTest extends TestCase
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

        // Use fake storage for testing
        Storage::fake();

        // Create test users
        $this->manager = User::factory()->create(['role' => 'manager']);
        $this->uploader = User::factory()->create(['role' => 'uploader']);
        $this->uploader2 = User::factory()->create(['role' => 'uploader']);
        $this->qc = User::factory()->create(['role' => 'qc']);
        $this->sbap = User::factory()->create(['role' => 'sbap']);
    }

    /** @test */
    public function uploader_can_upload_nilai_document_and_audit_log_is_recorded()
    {
        $this->actingAs($this->uploader);

        $file = UploadedFile::fake()->create('nilai.pdf', 1000, 'application/pdf');

        $response = $this->postJson('/api/documents', [
            'document_type' => 'nilai',
            'file' => $file,
            'prodi' => 'Teknik Informatika',
            'tahun_ajaran' => '2023/2024',
            'mata_kuliah' => 'Pemrograman Web',
            'kelas' => 'A',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'id',
                    'document_type',
                    'file_name',
                    'status',
                    'prodi',
                    'uploaded_by',
                ],
            ])
            ->assertJson([
                'data' => [
                    'document_type' => 'nilai',
                    'status' => 'menunggu_verifikasi',
                ],
            ]);

        // Verify document in database with duplicate_key
        $document = Document::first();
        $this->assertNotNull($document->duplicate_key);
        $this->assertEquals(64, strlen($document->duplicate_key)); // SHA1 = 40 chars hex

        $this->assertDatabaseHas('documents', [
            'document_type' => 'nilai',
            'prodi' => 'Teknik Informatika',
            'tahun_ajaran' => '2023/2024',
            'mata_kuliah' => 'Pemrograman Web',
            'kelas' => 'A',
            'status' => 'menunggu_verifikasi',
            'uploaded_by' => $this->uploader->id,
        ]);

        // Verify file stored in storage
        Storage::assertExists($document->file_path);

        // Verify audit log
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->uploader->id,
            'action' => 'upload_document',
        ]);

        $auditLog = AuditLog::where('action', 'upload_document')->first();
        $this->assertNotNull($auditLog);
        $this->assertEquals($document->id, $auditLog->metadata['document_id']);
    }

    /** @test */
    public function manager_can_upload_document()
    {
        $this->actingAs($this->manager);

        $file = UploadedFile::fake()->create('ijazah.pdf', 500, 'application/pdf');

        $response = $this->postJson('/api/documents', [
            'document_type' => 'ijazah',
            'file' => $file,
            'prodi' => 'Teknik Informatika',
            'tahun_lulus' => '2023',
            'npm' => '12345678',
        ]);

        $response->assertStatus(201);
    }

    /** @test */
    public function sbap_cannot_upload_document()
    {
        $this->actingAs($this->sbap);

        $file = UploadedFile::fake()->create('transkrip.pdf', 500, 'application/pdf');

        $response = $this->postJson('/api/documents', [
            'document_type' => 'transkrip',
            'file' => $file,
            'prodi' => 'Teknik Informatika',
            'tahun_lulus' => '2023',
            'npm' => '12345678',
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function qc_cannot_upload_document()
    {
        $this->actingAs($this->qc);

        $file = UploadedFile::fake()->create('nilai.pdf', 500, 'application/pdf');

        $response = $this->postJson('/api/documents', [
            'document_type' => 'nilai',
            'file' => $file,
            'prodi' => 'Teknik Informatika',
            'tahun_ajaran' => '2023/2024',
            'mata_kuliah' => 'Basis Data',
            'kelas' => 'B',
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function duplicate_nilai_document_is_rejected()
    {
        $this->actingAs($this->uploader);

        // Upload first document
        $file1 = UploadedFile::fake()->create('nilai1.pdf', 500, 'application/pdf');
        $this->postJson('/api/documents', [
            'document_type' => 'nilai',
            'file' => $file1,
            'prodi' => 'Teknik Informatika',
            'tahun_ajaran' => '2023/2024',
            'mata_kuliah' => 'Algoritma',
            'kelas' => 'A',
        ])->assertStatus(201);

        // Try to upload duplicate
        $file2 = UploadedFile::fake()->create('nilai2.pdf', 500, 'application/pdf');
        $response = $this->postJson('/api/documents', [
            'document_type' => 'nilai',
            'file' => $file2,
            'prodi' => 'Teknik Informatika',
            'tahun_ajaran' => '2023/2024',
            'mata_kuliah' => 'Algoritma',
            'kelas' => 'A',
        ]);

        $response->assertStatus(409)
            ->assertJson([
                'message' => 'Dokumen duplikat terdeteksi.',
            ]);

        // Verify only one document exists
        $this->assertEquals(1, Document::count());
    }

    /** @test */
    public function duplicate_ijazah_document_is_rejected()
    {
        $this->actingAs($this->manager);

        // Upload first ijazah
        $file1 = UploadedFile::fake()->create('ijazah1.pdf', 500, 'application/pdf');
        $this->postJson('/api/documents', [
            'document_type' => 'ijazah',
            'file' => $file1,
            'prodi' => 'Teknik Informatika',
            'tahun_lulus' => '2023',
            'npm' => '11111111',
        ])->assertStatus(201);

        // Try to upload duplicate ijazah
        $file2 = UploadedFile::fake()->create('ijazah2.pdf', 500, 'application/pdf');
        $response = $this->postJson('/api/documents', [
            'document_type' => 'ijazah',
            'file' => $file2,
            'prodi' => 'Teknik Informatika',
            'tahun_lulus' => '2023',
            'npm' => '11111111',
        ]);

        $response->assertStatus(409);
        $this->assertEquals(1, Document::count());
    }

    /** @test */
    public function duplicate_key_unique_constraint_works()
    {
        $this->actingAs($this->uploader);

        // Create first document
        $doc1 = Document::factory()->create([
            'document_type' => 'nilai',
            'prodi' => 'Teknik Informatika',
            'tahun_ajaran' => '2024/2025',
            'mata_kuliah' => 'Database',
            'kelas' => 'A',
            'uploaded_by' => $this->uploader->id,
        ]);

        // Try to create duplicate via factory (should fail at DB level)
        $this->expectException(\Illuminate\Database\QueryException::class);

        Document::factory()->create([
            'document_type' => 'nilai',
            'prodi' => 'Teknik Informatika',
            'tahun_ajaran' => '2024/2025',
            'mata_kuliah' => 'Database',
            'kelas' => 'A',
            'uploaded_by' => $this->uploader->id,
            'duplicate_key' => $doc1->duplicate_key, // Same duplicate_key
        ]);
    }

    /** @test */
    public function uploader_cannot_update_document_with_menunggu_verifikasi_status()
    {
        $this->actingAs($this->uploader);

        // Create document with menunggu_verifikasi status
        $document = Document::factory()->pending()->create([
            'uploaded_by' => $this->uploader->id,
        ]);

        // Try to update - should fail because status is menunggu_verifikasi
        $response = $this->patchJson("/api/documents/{$document->id}", [
            'file_name' => 'updated.pdf',
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function uploader_can_update_own_rejected_document()
    {
        $this->actingAs($this->uploader);

        // Create document with tidak_terverifikasi (rejected) status
        $document = Document::factory()->rejected()->create([
            'uploaded_by' => $this->uploader->id,
        ]);

        // Should be able to update own rejected document
        // Note: actual update endpoint not implemented yet, testing policy only
        $this->assertTrue($this->uploader->can('update', $document));
    }

    /** @test */
    public function uploader_cannot_update_other_users_rejected_document()
    {
        $this->actingAs($this->uploader);

        // Create document owned by uploader2
        $document = Document::factory()->rejected()->create([
            'uploaded_by' => $this->uploader2->id,
        ]);

        // Should NOT be able to update other user's document
        $this->assertFalse($this->uploader->can('update', $document));
    }

    /** @test */
    public function uploader_cannot_download_document()
    {
        $this->actingAs($this->uploader);

        $document = Document::factory()->verified()->create([
            'uploaded_by' => $this->uploader2->id,
        ]);

        // Uploader cannot download documents (only manager and sbap can)
        $this->assertFalse($this->uploader->can('download', $document));
    }

    /** @test */
    public function manager_can_download_any_document()
    {
        $this->actingAs($this->manager);

        $pendingDoc = Document::factory()->pending()->create();
        $verifiedDoc = Document::factory()->verified()->create();
        $rejectedDoc = Document::factory()->rejected()->create();

        // Manager can download any document regardless of status
        $this->assertTrue($this->manager->can('download', $pendingDoc));
        $this->assertTrue($this->manager->can('download', $verifiedDoc));
        $this->assertTrue($this->manager->can('download', $rejectedDoc));
    }

    /** @test */
    public function sbap_can_only_download_verified_documents()
    {
        $this->actingAs($this->sbap);

        $pendingDoc = Document::factory()->pending()->create();
        $verifiedDoc = Document::factory()->verified()->create();
        $rejectedDoc = Document::factory()->rejected()->create();

        // SBAP can only download verified documents
        $this->assertFalse($this->sbap->can('download', $pendingDoc));
        $this->assertTrue($this->sbap->can('download', $verifiedDoc));
        $this->assertFalse($this->sbap->can('download', $rejectedDoc));
    }

    /** @test */
    public function file_must_be_pdf()
    {
        $this->actingAs($this->uploader);

        $file = UploadedFile::fake()->create('document.docx', 500, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

        $response = $this->postJson('/api/documents', [
            'document_type' => 'nilai',
            'file' => $file,
            'prodi' => 'Teknik Informatika',
            'tahun_ajaran' => '2023/2024',
            'mata_kuliah' => 'Web',
            'kelas' => 'A',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    /** @test */
    public function file_size_must_not_exceed_5mb()
    {
        $this->actingAs($this->uploader);

        $file = UploadedFile::fake()->create('large.pdf', 6000, 'application/pdf'); // 6MB

        $response = $this->postJson('/api/documents', [
            'document_type' => 'nilai',
            'file' => $file,
            'prodi' => 'Teknik Informatika',
            'tahun_ajaran' => '2023/2024',
            'mata_kuliah' => 'Web',
            'kelas' => 'A',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    /** @test */
    public function required_fields_for_nilai_document()
    {
        $this->actingAs($this->uploader);

        $file = UploadedFile::fake()->create('nilai.pdf', 500, 'application/pdf');

        $response = $this->postJson('/api/documents', [
            'document_type' => 'nilai',
            'file' => $file,
            'prodi' => 'Teknik Informatika',
            // Missing: tahun_ajaran, mata_kuliah, kelas
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['tahun_ajaran', 'mata_kuliah', 'kelas']);
    }

    /** @test */
    public function required_fields_for_ijazah_document()
    {
        $this->actingAs($this->manager);

        $file = UploadedFile::fake()->create('ijazah.pdf', 500, 'application/pdf');

        $response = $this->postJson('/api/documents', [
            'document_type' => 'ijazah',
            'file' => $file,
            'prodi' => 'Teknik Informatika',
            // Missing: tahun_lulus, npm
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['tahun_lulus', 'npm']);
    }

    /** @test */
    public function can_list_documents()
    {
        $this->actingAs($this->uploader);

        // Create some documents
        Document::factory()->count(3)->create([
            'uploaded_by' => $this->uploader->id,
        ]);

        $response = $this->getJson('/api/documents');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'data' => [
                    '*' => ['id', 'document_type', 'file_name', 'status'],
                ],
                'meta' => ['current_page', 'last_page', 'per_page', 'total'],
            ]);
    }

    /** @test */
    public function uploaded_file_is_stored_in_private_storage()
    {
        $this->actingAs($this->uploader);

        $file = UploadedFile::fake()->create('test.pdf', 500, 'application/pdf');

        $this->postJson('/api/documents', [
            'document_type' => 'nilai',
            'file' => $file,
            'prodi' => 'Teknik Informatika',
            'tahun_ajaran' => '2023/2024',
            'mata_kuliah' => 'Web',
            'kelas' => 'A',
        ]);

        $document = Document::first();

        // Verify file path structure
        $this->assertStringContainsString('archives/nilai/', $document->file_path);

        // Verify file exists in storage
        Storage::assertExists($document->file_path);

        // Verify file is not in public disk
        $this->assertStringNotContainsString('public/', $document->file_path);
    }
}
