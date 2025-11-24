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
        // Admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Gallery users
        $galleryUsers = [
            ['name' => 'Galeria Sztuki Współczesnej', 'email' => 'wspolczesna@example.com'],
            ['name' => 'Salon Artystyczny', 'email' => 'salon@example.com'],
            ['name' => 'Galeria Malarstwa', 'email' => 'malarstwo@example.com'],
            ['name' => 'Przestrzeń Sztuki', 'email' => 'przestrzen@example.com'],
            ['name' => 'Galeria Kreativa', 'email' => 'kreativa@example.com'],
        ];

        foreach ($galleryUsers as $userData) {
            User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make('password'),
                'role' => 'gallery',
                'email_verified_at' => now(),
            ]);
        }

        // Test client user
        User::create([
            'name' => 'Test Client',
            'email' => 'client@example.com',
            'password' => Hash::make('password'),
            'role' => 'client',
            'email_verified_at' => now(),
        ]);
    }
}
