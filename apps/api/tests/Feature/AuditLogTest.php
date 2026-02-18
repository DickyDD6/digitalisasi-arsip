<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuditLogTest extends TestCase
{
    use RefreshDatabase;

    protected User $manager;
    protected User $uploader;

    protected function setUp(): void
    {
        parent::setUp();

        $this->manager = User::factory()->manager()->create();
        $this->uploader = User::factory()->uploader()->create();

        // Create some audit logs
        AuditLog::factory()->count(5)->create([
            'user_id' => $this->uploader->id,
            'action' => 'upload_document',
        ]);

        AuditLog::factory()->count(3)->create([
            'user_id' => $this->manager->id,
            'action' => 'create_user',
        ]);
    }

    /** @test */
    public function manager_can_view_audit_logs()
    {
        $response = $this->actingAs($this->manager)
            ->getJson('/api/audit-logs');

        $response->assertOk()
            ->assertJsonStructure([
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'user' => ['name', 'role'],
                        'action' => ['name', 'label', 'color'],
                        'document' => ['id_formatted', 'name'],
                        'description',
                        'date' => ['formatted', 'time', 'timestamp'],
                    ],
                ],
                'meta',
            ]);
    }

    /** @test */
    public function non_manager_cannot_view_audit_logs()
    {
        $response = $this->actingAs($this->uploader)
            ->getJson('/api/audit-logs');

        $response->assertForbidden();
    }

    /** @test */
    public function can_filter_audit_logs_by_action()
    {
        $response = $this->actingAs($this->manager)
            ->getJson('/api/audit-logs?action=upload_document');

        $response->assertOk();

        $data = $response->json('data');
        $this->assertNotEmpty($data);

        foreach ($data as $log) {
            $this->assertEquals('upload_document', $log['action']['name']);
        }
    }

    /** @test */
    public function can_filter_audit_logs_by_user()
    {
        $response = $this->actingAs($this->manager)
            ->getJson('/api/audit-logs?user_id=' . $this->uploader->id);

        $response->assertOk();

        $data = $response->json('data');
        $this->assertNotEmpty($data);

        foreach ($data as $log) {
            $this->assertEquals($this->uploader->name, $log['user']['name']);
        }
    }

    /** @test */
    public function can_search_audit_logs_by_description()
    {
        // Create log with specific description
        AuditLog::create([
            'user_id' => $this->manager->id,
            'action' => 'test_action',
            'description' => 'Special test description for searching',
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->actingAs($this->manager)
            ->getJson('/api/audit-logs?search=Special test');

        $response->assertOk();

        $data = $response->json('data');
        $this->assertNotEmpty($data);
        $this->assertStringContainsString('Special test', $data[0]['description']);
    }

    /** @test */
    public function manager_can_view_statistics()
    {
        $response = $this->actingAs($this->manager)
            ->getJson('/api/audit-logs/statistics');

        $response->assertOk()
            ->assertJsonStructure([
                'message',
                'data' => [
                    'total_activities',
                    'today_total',
                    'today_upload',
                    'today_verify',
                    'today_reject',
                    'by_action',
                    'recent_activities',
                ],
                'period' => [
                    'start_date',
                    'end_date',
                ],
            ]);
    }

    /** @test */
    public function statistics_shows_correct_counts()
    {
        $response = $this->actingAs($this->manager)
            ->getJson('/api/audit-logs/statistics');

        $response->assertOk();

        $data = $response->json('data');
        $this->assertEquals(8, $data['total_activities']); // 5 + 3 from setUp
        // by_action keys are now labels
        // 'upload_document' -> 'Unggah'
        // 'create_user' -> 'Buat Pengguna'
        $this->assertArrayHasKey('Unggah', $data['by_action']);
        $this->assertArrayHasKey('Buat Pengguna', $data['by_action']);
    }

    /** @test */
    public function unauthenticated_user_cannot_access_audit_logs()
    {
        $response = $this->getJson('/api/audit-logs');
        $response->assertUnauthorized();
    }
}
