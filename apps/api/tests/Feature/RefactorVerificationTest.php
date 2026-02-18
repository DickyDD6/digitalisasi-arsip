<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\User;
use App\Enums\DocumentStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class RefactorVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_upload_sets_pending_status_from_enum()
    {
        Storage::fake();
        $uploader = User::factory()->create(['role' => 'uploader']);

        $file = UploadedFile::fake()->createWithContent('test.pdf', '%PDF-1.4 dummy content');

        $response = $this->actingAs($uploader)->postJson('/api/documents', [
            'document_type' => 'nilai',
            'file' => $file,
            'prodi' => 'Teknik Informatika',
            'tahun_ajaran' => '2023/2024',
            'mata_kuliah' => 'Test MK',
            'kelas' => 'A',
        ]);

        $response->assertStatus(201);

        $document = Document::first();
        $this->assertEquals(DocumentStatus::PENDING, $document->status);
        $this->assertEquals(DocumentStatus::PENDING->value, $document->getRawOriginal('status'));
    }

    public function test_verify_sets_verified_status_from_enum()
    {
        Storage::fake();
        $manager = User::factory()->create(['role' => 'manager']);
        $uploader = User::factory()->create(['role' => 'uploader']);

        $document = Document::factory()->create([
            'status' => DocumentStatus::PENDING,
            'uploaded_by' => $uploader->id,
            'document_type' => 'nilai', // Ensure this matches a valid type
            'prodi' => 'Teknik Informatika',
        ]);

        $response = $this->actingAs($manager)->patchJson("/api/documents/{$document->id}/verify", [
            'status' => 'terverifikasi', // The request still sends string from frontend
            'verification_note' => 'OK',
        ]);

        $response->assertStatus(200);

        $document->refresh();
        $this->assertEquals(DocumentStatus::VERIFIED, $document->status);
    }
}
