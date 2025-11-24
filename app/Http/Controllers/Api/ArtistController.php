<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArtistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $artists = Artist::withCount(['artworks' => function ($query) {
            $query->approved();
        }])
            ->get();

        // Manual pagination
        $perPage = $request->get('per_page', 20);
        $page = $request->get('page', 1);
        $total = $artists->count();

        $results = $artists->forPage($page, $perPage);

        return response()->json([
            'data' => $results,
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => $total,
            'last_page' => ceil($total / $perPage),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug): JsonResponse
    {
        $artist = Artist::where('slug', $slug)
            ->with(['artworks' => function ($query) {
                $query->approved()->activeGallery()->with(['gallery']);
            }])
            ->firstOrFail();

        return response()->json($artist);
    }
}
