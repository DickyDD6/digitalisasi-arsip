<?php

namespace Database\Seeders;

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
                'role' => 'manager',
            ],
            [
                'name' => 'Tim Uploader',
                'email' => 'uploader@test.com',
                'password' => Hash::make('password'),
                'role' => 'uploader',
            ],
            [
                'name' => 'Tim Quality Control',
                'email' => 'qc@test.com',
                'password' => Hash::make('password'),
                'role' => 'qc',
            ],
            [
                'name' => 'SBAP User',
                'email' => 'sbap@test.com',
                'password' => Hash::make('password'),
                'role' => 'sbap',
            ],
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }
    }
}
