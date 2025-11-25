<?php

namespace Database\Seeders;

use App\Models\Gallery;
use App\Models\User;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the two gallery users (IDs 2 and 3)
        $galleryUser1 = User::where('email', 'gallery1@example.com')->first();
        $galleryUser2 = User::where('email', 'gallery2@example.com')->first();

        // Gallery 1 - Approved
        Gallery::create([
            'user_id' => $galleryUser1->id,
            'name' => 'Galeria Sztuki Współczesnej',
            'description' => 'Wiodąca galeria prezentująca najnowsze trendy w sztuce współczesnej.',
            'is_approved' => true,
            'approved_at' => now(),
            'status' => 'active',
        ]);

        // Gallery 2 - Approved
        Gallery::create([
            'user_id' => $galleryUser2->id,
            'name' => 'Damian Gallery',
            'description' => 'Gallery for Damian',
            'is_approved' => true,
            'approved_at' => now(),
            'status' => 'active',
        ]);
    }
}
