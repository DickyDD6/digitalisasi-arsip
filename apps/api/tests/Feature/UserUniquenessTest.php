<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserUniquenessTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function nip_must_be_unique()
    {
        // Create first user
        User::factory()->create([
            'nip' => '12345678',
            'email' => 'user1@example.com',
        ]);

        // Try to create second user with same NIP
        $this->expectException(\Illuminate\Database\QueryException::class);
        // Expect standard SQLSTATE 23000 (integrity constraint violation)

        User::factory()->create([
            'nip' => '12345678',
            'email' => 'user2@example.com',
        ]);
    }

    /** @test */
    public function check_email_returns_unavailable_if_email_exists()
    {
        $user = User::factory()->create([
            'email' => 'existing@example.com',
        ]);

        $response = $this->postJson('/api/auth/check-email', [
            'email' => 'existing@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'available' => false,
                'message' => 'Email sudah digunakan.',
            ]);
    }

    /** @test */
    public function check_email_returns_available_if_email_does_not_exist()
    {
        $response = $this->postJson('/api/auth/check-email', [
            'email' => 'new@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'available' => true,
                'message' => 'Email tersedia.',
            ]);
    }

    /** @test */
    public function check_email_validate_email_format()
    {
        $response = $this->postJson('/api/auth/check-email', [
            'email' => 'not-an-email',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }
}
