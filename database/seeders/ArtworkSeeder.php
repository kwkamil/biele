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
        $artists = Artist::all();
        $galleries = Gallery::where('is_approved', true)->get();

        $categories = ['Malarstwo', 'Rzeźba', 'Grafika', 'Fotografia', 'Instalacja'];
        $styles = ['Abstrakcja', 'Realizm', 'Impresjonizm', 'Surrealizm', 'Minimalizm'];
        $themes = ['Portret', 'Peizaż', 'Martwa natura', 'Abstrakcja', 'Architektura'];
        $mediums = ['Olej na płótnie', 'Akryl', 'Akwarela', 'Ryśunek', 'Mieszana'];

        $artworksData = [
            'Zachwód słońca',
            'Miejskie refleksje',
            'Abstrakcyjne emocje',
            'Portret w złocie',
            'Morski peizaż',
            'Taniec kolorów',
            'Cisza gór',
            'Rytm miasta',
            'Wspomnienia lata',
            'Medytacja',
            'Burza nad morzem',
            'Geometria natury',
            'Tajemniczy las',
            'Architektura duszy',
            'Harmonia',
            'Kontrast',
            'Energia',
            'Spokoj',
            'Dynamika',
            'Retrospekcja',
            'Przyszłość',
            'Czas',
            'Przestrzeń',
            'Ruch',
            'Cisza',
            'Głos',
            'Cienie',
            'Światło',
            'Mrok',
            'Jasność',
            'Uczucia',
            'Myśli',
            'Marzenia',
            'Rzeczywistość',
            'Wyobraźnia',
            'Intuicja',
            'Logika',
            'Chaos',
            'Porządek',
            'Wolność',
            'Więzy',
            'Migracja',
            'Podroż',
            'Dom',
            'Obcość',
            'Znajomość',
            'Tożsamość',
            'Transformacja',
            'Ewolucja',
            'Rewolucja',
        ];

        foreach ($artworksData as $index => $title) {
            if ($index >= 50) {
                break;
            } // Limit to 50 artworks

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
                'is_approved' => fake()->boolean(80), // 80% chance of being approved
                'approved_at' => fake()->boolean(80) ? now() : null,
            ]);
        }
    }
}
