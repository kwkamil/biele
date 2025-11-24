<?php

namespace Database\Seeders;

use App\Models\Artist;
use Illuminate\Database\Seeder;

class ArtistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $artists = [
            [
                'name' => 'Anna Kowalska',
                'biography' => 'Malarka specjalizująca się w malarstwie olejnym. Absolwentka ASP w Warszawie.',
            ],
            [
                'name' => 'Piotr Nowak',
                'biography' => 'Rzeźbiarz tworzący w kamieniu i brązie. Laureat wielu nagród krajowych.',
            ],
            [
                'name' => 'Maria Wójcik',
                'biography' => 'Artystka multimedialna łącząca tradycyjne techniki z nowymi mediami.',
            ],
            [
                'name' => 'Tomasz Zieliński',
                'biography' => 'Fotograf i malarz, twórca unikalnych kompozycji abstrakcyjnych.',
            ],
            [
                'name' => 'Katarzyna Lewandowska',
                'biography' => 'Graficzka i ilustratorka, specjalistka w dziedzinie grafiki użytkowej.',
            ],
            [
                'name' => 'Jakub Kamiński',
                'biography' => 'Malarz peizażysta, miłośnik pleneru i natury.',
            ],
            [
                'name' => 'Agnieszka Dąbrowska',
                'biography' => 'Ceramiczka tworząca unikalne dzieła użytkowe i dekoracyjne.',
            ],
            [
                'name' => 'Marek Jankowski',
                'biography' => 'Artysta konceptualny, twórca instalacji i obiektów artystycznych.',
            ],
            [
                'name' => 'Joanna Mazurek',
                'biography' => 'Malarka specjalizująca się w portrecie i malarstwie figuratywnym.',
            ],
            [
                'name' => 'Paweł Krawczyk',
                'biography' => 'Grafik i designer, twórca plakatów i ilustracji.',
            ],
        ];

        foreach ($artists as $artistData) {
            Artist::create($artistData);
        }
    }
}
