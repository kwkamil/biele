<?php

namespace App\Http\Controllers\Gallery;

use App\Http\Controllers\Controller;
use App\Models\Artwork;
use App\Models\Artist;
use App\Models\Inquiry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $gallery = $user->gallery;

        if (! $gallery) {
            abort(403, 'You do not have a gallery associated with your account.');
        }

        $artworksCount = Artwork::where('gallery_id', $gallery->id)->count();
        $approvedArtworksCount = Artwork::where('gallery_id', $gallery->id)
            ->where('is_approved', true)
            ->count();

        // Count unique artists who have artworks in this gallery
        $artistsCount = Artwork::where('gallery_id', $gallery->id)
            ->distinct('artist_id')
            ->count('artist_id');

        // Get inquiries for artworks belonging to this gallery
        $galleryArtworkIds = Artwork::where('gallery_id', $gallery->id)->pluck('id')->toArray();
        $inquiriesCount = Inquiry::where('status', 'verified')
            ->get()
            ->filter(function ($inquiry) use ($galleryArtworkIds) {
                return count(array_intersect($inquiry->artwork_ids ?? [], $galleryArtworkIds)) > 0;
            })
            ->count();

        return Inertia::render('gallery/dashboard', [
            'gallery' => $gallery,
            'stats' => [
                'artworks' => $artworksCount,
                'approved_artworks' => $approvedArtworksCount,
                'artists' => $artistsCount,
                'inquiries' => $inquiriesCount,
            ],
        ]);
    }
}
