<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Manager Arsip',
                'email' => 'manager@test.com',
                'password' => Hash::make('password'),
                'role' => UserRole::MANAGER,
            ],
            [
                'name' => 'Tim Uploader',
                'email' => 'uploader@test.com',
                'password' => Hash::make('password'),
                'role' => UserRole::UPLOADER,
            ],
            [
                'name' => 'Tim Quality Control',
                'email' => 'qc@test.com',
                'password' => Hash::make('password'),
                'role' => UserRole::QC,
            ],
            [
                'name' => 'SBAP User',
                'email' => 'sbap@test.com',
                'password' => Hash::make('password'),
                'role' => UserRole::SBAP,
            ],
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        User::factory()->count(20)->create();
    }
}

