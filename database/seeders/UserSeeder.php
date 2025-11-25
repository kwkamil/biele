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
        // 1. Admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // 2-3. Gallery users (2 users)
        User::create([
            'name' => 'Galeria Sztuki Współczesnej',
            'email' => 'gallery1@example.com',
            'password' => Hash::make('password'),
            'role' => 'gallery',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Damian Gallery',
            'email' => 'gallery2@example.com',
            'password' => Hash::make('password'),
            'role' => 'gallery',
            'email_verified_at' => now(),
        ]);

        // 4-5. Normal client users (2 users)
        User::create([
            'name' => 'Jan Kowalski',
            'email' => 'jan@example.com',
            'password' => Hash::make('password'),
            'role' => 'client',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Anna Nowak',
            'email' => 'anna@example.com',
            'password' => Hash::make('password'),
            'role' => 'client',
            'email_verified_at' => now(),
        ]);
    }
}
