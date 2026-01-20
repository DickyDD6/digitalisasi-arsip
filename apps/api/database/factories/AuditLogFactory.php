<?php

namespace Database\Factories;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AuditLog>
 */
class AuditLogFactory extends Factory
{
    protected $model = AuditLog::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $actions = [
            'create_user',
            'update_user',
            'delete_user',
            'upload_document',
            'verify_document',
            'reject_document',
            'update_document',
            'delete_document',
            'download_document',
        ];

        $modelTypes = [
            \App\Models\User::class,
            \App\Models\Document::class,
            null,
        ];

        return [
            'user_id' => User::factory(),
            'action' => fake()->randomElement($actions),
            'model_type' => fake()->randomElement($modelTypes),
            'model_id' => fake()->optional()->numberBetween(1, 100),
            'description' => fake()->sentence(),
            'metadata' => [
                'test_key' => fake()->word(),
                'timestamp' => now()->toISOString(),
            ],
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'created_at' => fake()->dateTimeBetween('-30 days', 'now'),
        ];
    }
}
