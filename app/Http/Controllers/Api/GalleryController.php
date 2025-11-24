<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $galleries = Gallery::approved()
            ->with('user:id,email')
            ->withCount(['artworks' => function ($query) {
                $query->approved();
            }])
            ->get()
            ->filter(fn ($gallery) => $gallery->artworks_count > 0)
            ->map(function ($gallery) {
                return [
                    'id' => $gallery->id,
                    'name' => $gallery->name,
                    'slug' => $gallery->slug,
                    'description' => $gallery->description,
                    'contact_email' => $gallery->user?->email,
                    'artworks_count' => $gallery->artworks_count,
                ];
            })
            ->values();

        // Manual pagination since SQLite has issues with HAVING + pagination
        $perPage = $request->get('per_page', 20);
        $page = $request->get('page', 1);
        $total = $galleries->count();

        $results = $galleries->forPage($page, $perPage);

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
        $gallery = Gallery::where('slug', $slug)
            ->approved()
            ->with(['artworks' => function ($query) {
                $query->approved()->with(['artist']);
            }, 'user:id,name,email'])
            ->firstOrFail();

        return response()->json([
            'id' => $gallery->id,
            'name' => $gallery->name,
            'slug' => $gallery->slug,
            'description' => $gallery->description,
            'contact_email' => $gallery->user?->email,
            'artworks' => $gallery->artworks,
        ]);
    }
}
