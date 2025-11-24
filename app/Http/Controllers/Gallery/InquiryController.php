<?php

namespace App\Http\Controllers\Gallery;

use App\Http\Controllers\Controller;
use App\Models\Artwork;
use App\Models\Inquiry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InquiryController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $gallery = $user->gallery;

        if (! $gallery) {
            abort(403, 'You do not have a gallery associated with your account.');
        }

        // Get all artworks belonging to this gallery
        $galleryArtworkIds = Artwork::where('gallery_id', $gallery->id)->pluck('id')->toArray();

        // Get all verified inquiries
        $allInquiries = Inquiry::where('status', 'verified')
            ->orderBy('created_at', 'desc')
            ->get();

        // Filter inquiries that include at least one artwork from this gallery
        $filteredInquiries = $allInquiries->filter(function ($inquiry) use ($galleryArtworkIds) {
            return count(array_intersect($inquiry->artwork_ids ?? [], $galleryArtworkIds)) > 0;
        })->values();

        // Manually paginate
        $perPage = 20;
        $page = $request->get('page', 1);
        $total = $filteredInquiries->count();
        $paginatedInquiries = $filteredInquiries->forPage($page, $perPage);

        return Inertia::render('gallery/inquiries/index', [
            'inquiries' => [
                'data' => $paginatedInquiries,
                'current_page' => (int) $page,
                'last_page' => ceil($total / $perPage),
                'per_page' => $perPage,
                'total' => $total,
            ],
        ]);
    }

    public function show(Request $request, Inquiry $inquiry): Response
    {
        $user = $request->user();
        $gallery = $user->gallery;

        if (! $gallery) {
            abort(403, 'You do not have a gallery associated with your account.');
        }

        // Verify that this inquiry is for artworks in this gallery
        $galleryArtworkIds = Artwork::where('gallery_id', $gallery->id)->pluck('id')->toArray();
        $hasGalleryArtwork = count(array_intersect($inquiry->artwork_ids ?? [], $galleryArtworkIds)) > 0;

        if (! $hasGalleryArtwork) {
            abort(403, 'This inquiry is not for your gallery.');
        }

        // Load the artworks associated with this inquiry
        $artworks = Artwork::with(['artist', 'gallery'])
            ->whereIn('id', $inquiry->artwork_ids ?? [])
            ->get();

        return Inertia::render('gallery/inquiries/show', [
            'inquiry' => $inquiry,
            'artworks' => $artworks,
        ]);
    }
}
