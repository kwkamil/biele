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
        $galleryUsers = User::where('role', 'gallery')->get();

        $galleriesData = [
            [
                'name' => 'Galeria Sztuki Współczesnej',
                'description' => 'Wiodąca galeria prezentująca najnowsze trendy w sztuce współczesnej.',
                'is_approved' => true,
                'approved_at' => now(),
            ],
            [
                'name' => 'Salon Artystyczny',
                'description' => 'Kameralna przestrzeń dla miłośników sztuki klasycznej i nowoczesnej.',
                'is_approved' => true,
                'approved_at' => now(),
            ],
            [
                'name' => 'Galeria Malarstwa',
                'description' => 'Specjalizujemy się w prezentacji dzieł malarskich różnych epok.',
                'is_approved' => false,
            ],
            [
                'name' => 'Przestrzeń Sztuki',
                'description' => 'Nowoczesna galeria promująca młodych artystów.',
                'is_approved' => false,
            ],
            [
                'name' => 'Galeria Kreativa',
                'description' => 'Miejsce spotkania sztuki tradycyjnej z nowymi mediami.',
                'is_approved' => true,
                'approved_at' => now(),
            ],
        ];

        foreach ($galleriesData as $index => $galleryData) {
            if (isset($galleryUsers[$index])) {
                Gallery::create([
                    'user_id' => $galleryUsers[$index]->id,
                    ...$galleryData,
                ]);
            }
        }
    }
}
