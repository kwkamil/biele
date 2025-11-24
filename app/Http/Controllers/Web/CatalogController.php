<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index()
    {
        return Inertia::render('catalog');
    }

    public function artwork(string $slug)
    {
        return Inertia::render('artwork-detail', [
            'slug' => $slug,
        ]);
    }

    public function artist(string $slug)
    {
        return Inertia::render('artist-detail', [
            'slug' => $slug,
        ]);
    }

    public function artists()
    {
        return Inertia::render('artists');
    }

    public function galleries()
    {
        return Inertia::render('galleries');
    }

    public function saved()
    {
        return Inertia::render('saved-artworks');
    }
}
