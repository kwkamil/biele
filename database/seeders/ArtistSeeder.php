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
        // 5 artists
        Artist::create([
            'name' => 'Anna Kowalska',
            'biography' => 'Malarka specjalizująca się w malarstwie olejnym. Absolwentka ASP w Warszawie.',
        ]);

        Artist::create([
            'name' => 'Piotr Nowak',
            'biography' => 'Rzeźbiarz tworzący w kamieniu i brązie. Laureat wielu nagród krajowych.',
        ]);

        Artist::create([
            'name' => 'Maria Wójcik',
            'biography' => 'Artystka multimedialna łącząca tradycyjne techniki z nowymi mediami.',
        ]);

        Artist::create([
            'name' => 'Tomasz Zieliński',
            'biography' => 'Fotograf i malarz, twórca unikalnych kompozycji abstrakcyjnych.',
        ]);

        Artist::create([
            'name' => 'Katarzyna Lewandowska',
            'biography' => 'Graficzka i ilustratorka, specjalistka w dziedzinie grafiki użytkowej.',
        ]);
    }
}
