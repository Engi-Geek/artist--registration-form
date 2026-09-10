<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Chief Administrator',
                'email' => 'admin@artistportal.gov.in',
                'password' => Hash::make('admin@2026'),
                'role' => 'SUPER_ADMIN',
                'is_active' => true,
            ]
        );
    }
}
