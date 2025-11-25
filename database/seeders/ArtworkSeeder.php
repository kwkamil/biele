<?php

namespace Database\Seeders;

use App\Models\Artist;
use App\Models\Artwork;
use App\Models\Gallery;
use Illuminate\Database\Seeder;

class ArtworkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all artists and galleries
        $artists = Artist::all();
        $galleries = Gallery::all();

        $categories = ['Malarstwo', 'Rzeźba', 'Grafika', 'Fotografia', 'Instalacja'];
        $styles = ['Abstrakcja', 'Realizm', 'Impresjonizm', 'Surrealizm', 'Minimalizm'];
        $themes = ['Portret', 'Pejzaż', 'Martwa natura', 'Abstrakcja', 'Architektura'];
        $mediums = ['Olej na płótnie', 'Akryl', 'Akwarela', 'Rysunek', 'Mieszana'];

        // 10 artworks
        $artworks = [
            'Zachód słońca',
            'Miejskie refleksje',
            'Abstrakcyjne emocje',
            'Portret w złocie',
            'Morski pejzaż',
            'Taniec kolorów',
            'Cisza gór',
            'Rytm miasta',
            'Wspomnienia lata',
            'Medytacja',
        ];

        foreach ($artworks as $index => $title) {
            $isApproved = $index < 7; // First 7 approved, last 3 pending

            Artwork::create([
                'title' => $title,
                'artist_id' => $artists->random()->id,
                'gallery_id' => $galleries->random()->id,
                'category' => fake()->randomElement($categories),
                'style' => fake()->randomElement($styles),
                'theme' => fake()->randomElement($themes),
                'price_min' => fake()->randomFloat(2, 500, 5000),
                'price_max' => fake()->randomFloat(2, 5000, 25000),
                'medium' => fake()->randomElement($mediums),
                'dimensions' => fake()->randomElement([
                    '30x40 cm', '50x70 cm', '80x100 cm', '100x120 cm', '40x50 cm',
                ]),
                'description' => fake()->paragraph(3),
                'is_approved' => $isApproved,
                'approved_at' => $isApproved ? now() : null,
            ]);
        }
    }
}
