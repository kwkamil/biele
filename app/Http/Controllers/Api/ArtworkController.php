<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artwork;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArtworkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Artwork::with(['artist', 'gallery'])
            ->approved()
            ->activeGallery()
            ->filter($request->only(['category', 'style', 'theme', 'artist_id', 'price_min', 'price_max']))
            ->orderBy('created_at', 'desc');

        $artworks = $query->paginate($request->get('per_page', 20));

        return response()->json($artworks);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug): JsonResponse
    {
        $artwork = Artwork::with(['artist', 'gallery'])
            ->approved()
            ->activeGallery()
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($artwork);
    }
}
