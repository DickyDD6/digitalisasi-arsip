<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $manager;
    protected User $uploader;
    protected User $qc;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test users
        $this->manager = User::factory()->create(['role' => 'manager']);
        $this->uploader = User::factory()->create(['role' => 'uploader']);
        $this->qc = User::factory()->create(['role' => 'qc']);
    }

    /** @test */
    public function manager_can_create_user_and_audit_log_is_recorded()
    {
        $this->actingAs($this->manager);

        $userData = [
            'name' => 'New User',
            'email' => 'newuser@test.com',
            'password' => 'password123',
            'role' => 'uploader',
        ];

        $response = $this->postJson('/api/users', $userData);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'User berhasil dibuat.',
                'data' => [
                    'name' => 'New User',
                    'email' => 'newuser@test.com',
                    'role' => 'uploader',
                ],
            ]);

        // Verify user created in database
        $this->assertDatabaseHas('users', [
            'email' => 'newuser@test.com',
            'role' => 'uploader',
        ]);

        // Verify audit log recorded
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->manager->id,
            'action' => 'create_user',
        ]);

        $auditLog = AuditLog::where('action', 'create_user')
            ->where('user_id', $this->manager->id)
            ->first();

        $this->assertNotNull($auditLog);
        $this->assertArrayHasKey('target_user_id', $auditLog->metadata);
        $this->assertArrayHasKey('target_email', $auditLog->metadata);
        $this->assertEquals('uploader', $auditLog->metadata['role']);
    }

    /** @test */
    public function uploader_cannot_create_user()
    {
        $this->actingAs($this->uploader);

        $userData = [
            'name' => 'New User',
            'email' => 'newuser@test.com',
            'password' => 'password123',
            'role' => 'uploader',
        ];

        $response = $this->postJson('/api/users', $userData);

        $response->assertStatus(403);
    }

    /** @test */
    public function qc_cannot_create_user()
    {
        $this->actingAs($this->qc);

        $userData = [
            'name' => 'New User',
            'email' => 'newuser@test.com',
            'password' => 'password123',
            'role' => 'qc',
        ];

        $response = $this->postJson('/api/users', $userData);

        $response->assertStatus(403);
    }

    /** @test */
    public function sbap_cannot_create_user()
    {
        $sbap = User::factory()->create(['role' => 'sbap']);
        $this->actingAs($sbap);

        $userData = [
            'name' => 'New User',
            'email' => 'newuser@test.com',
            'password' => 'password123',
            'role' => 'sbap',
        ];

        $response = $this->postJson('/api/users', $userData);

        $response->assertStatus(403);
    }

    /** @test */
    public function manager_cannot_delete_themselves()
    {
        $this->actingAs($this->manager);

        $response = $this->deleteJson("/api/users/{$this->manager->id}");

        $response->assertStatus(422)
            ->assertJson([
                'message' => 'Tidak dapat menghapus akun sendiri.',
                'errors' => [
                    'user_id' => ['Anda tidak dapat menghapus akun Anda sendiri.'],
                ],
            ]);

        // Verify manager still exists
        $this->assertDatabaseHas('users', [
            'id' => $this->manager->id,
            'email' => $this->manager->email,
        ]);
    }

    /** @test */
    public function manager_can_delete_other_users()
    {
        $this->actingAs($this->manager);

        $response = $this->deleteJson("/api/users/{$this->uploader->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'User berhasil dihapus.',
            ]);

        // Verify user deleted
        $this->assertDatabaseMissing('users', [
            'id' => $this->uploader->id,
        ]);

        // Verify audit log recorded
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->manager->id,
            'action' => 'delete_user',
        ]);
    }

    /** @test */
    public function manager_can_update_user_and_audit_log_is_recorded()
    {
        $this->actingAs($this->manager);

        $updateData = [
            'name' => 'Updated Name',
            'role' => 'qc',
        ];

        $response = $this->patchJson("/api/users/{$this->uploader->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'User berhasil diupdate.',
                'data' => [
                    'name' => 'Updated Name',
                    'role' => 'qc',
                ],
            ]);

        // Verify user updated
        $this->assertDatabaseHas('users', [
            'id' => $this->uploader->id,
            'name' => 'Updated Name',
            'role' => 'qc',
        ]);

        // Verify audit log recorded
        $auditLog = AuditLog::where('action', 'update_user')
            ->where('user_id', $this->manager->id)
            ->first();

        $this->assertNotNull($auditLog);
        $this->assertArrayHasKey('changed_fields', $auditLog->metadata);
        $this->assertContains('name', $auditLog->metadata['changed_fields']);
        $this->assertContains('role', $auditLog->metadata['changed_fields']);
        $this->assertEquals('uploader', $auditLog->metadata['old_role']);
        $this->assertEquals('qc', $auditLog->metadata['new_role']);
    }

    /** @test */
    public function manager_can_list_users()
    {
        $this->actingAs($this->manager);

        $response = $this->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'data' => [
                    '*' => ['id', 'name', 'email', 'role', 'created_at', 'updated_at'],
                ],
                'meta' => ['current_page', 'last_page', 'per_page', 'total'],
            ]);
    }

    /** @test */
    public function uploader_cannot_list_users()
    {
        $this->actingAs($this->uploader);

        $response = $this->getJson('/api/users');

        $response->assertStatus(403);
    }

    /** @test */
    public function manager_can_view_user_details()
    {
        $this->actingAs($this->manager);

        $response = $this->getJson("/api/users/{$this->uploader->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Detail user berhasil diambil.',
                'data' => [
                    'id' => $this->uploader->id,
                    'email' => $this->uploader->email,
                ],
            ]);
    }

    /** @test */
    public function create_user_validates_required_fields()
    {
        $this->actingAs($this->manager);

        $response = $this->postJson('/api/users', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password', 'role']);
    }

    /** @test */
    public function create_user_validates_email_uniqueness()
    {
        $this->actingAs($this->manager);

        $response = $this->postJson('/api/users', [
            'name' => 'Test',
            'email' => $this->uploader->email, // Duplicate email
            'password' => 'password123',
            'role' => 'uploader',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function create_user_validates_role_enum()
    {
        $this->actingAs($this->manager);

        $response = $this->postJson('/api/users', [
            'name' => 'Test',
            'email' => 'test@test.com',
            'password' => 'password123',
            'role' => 'invalid_role',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['role']);
    }

    /** @test */
    public function unauthenticated_user_cannot_access_user_management()
    {
        $response = $this->getJson('/api/users');

        $response->assertStatus(401);
    }
}
