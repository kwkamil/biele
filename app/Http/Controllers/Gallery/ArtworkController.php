<?php

namespace App\Http\Controllers\Gallery;

use App\Http\Controllers\Controller;
use App\Models\Artist;
use App\Models\Artwork;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ArtworkController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $gallery = $user->gallery;

        if (! $gallery) {
            abort(403, 'You do not have a gallery associated with your account.');
        }

        $artworks = Artwork::with(['artist', 'gallery'])
            ->where('gallery_id', $gallery->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('gallery/artworks/index', [
            'artworks' => $artworks,
        ]);
    }

    public function create(Request $request): Response
    {
        $user = $request->user();
        $gallery = $user->gallery;

        if (! $gallery) {
            abort(403, 'You do not have a gallery associated with your account.');
        }

        // Get all artists
        $artists = Artist::orderBy('name')->get();

        return Inertia::render('gallery/artworks/create', [
            'artists' => $artists,
            'gallery' => $gallery,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $gallery = $user->gallery;

        if (! $gallery) {
            abort(403, 'You do not have a gallery associated with your account.');
        }

        $validated = $request->validate([
            'artist_id' => 'required|exists:artists,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'year' => 'nullable|integer|min:1000|max:'.(date('Y') + 1),
            'medium' => 'nullable|string|max:255',
            'dimensions' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'category' => 'nullable|string|max:255',
            'style' => 'nullable|string|max:255',
            'theme' => 'nullable|string|max:255',
            'image_url' => 'nullable|image|max:10240',
            'additional_images' => 'nullable|array',
            'additional_images.*' => 'image|max:10240',
        ]);

        // Handle main image upload
        if ($request->hasFile('image_url')) {
            $validated['featured_image'] = $request->file('image_url')->store('artworks', 'public');
            unset($validated['image_url']);
        }

        // Handle additional images upload
        if ($request->hasFile('additional_images')) {
            $additionalImages = [];
            foreach ($request->file('additional_images') as $image) {
                $additionalImages[] = $image->store('artworks', 'public');
            }
            $validated['additional_images'] = $additionalImages;
        }

        // Handle price - set both price_min and price_max to the same value
        if (isset($validated['price']) && $validated['price']) {
            $validated['price_min'] = $validated['price'];
            $validated['price_max'] = $validated['price'];
            unset($validated['price']);
        }

        $validated['gallery_id'] = $gallery->id;
        $validated['is_approved'] = false;

        Artwork::create($validated);

        return redirect()->route('gallery.artworks.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Artwork created successfully. It will be visible after admin approval.',
            ]);
    }

    public function edit(Request $request, Artwork $artwork): Response
    {
        $user = $request->user();
        $gallery = $user->gallery;

        if (! $gallery || $artwork->gallery_id !== $gallery->id) {
            abort(403, 'You do not have permission to edit this artwork.');
        }

        $artists = Artist::orderBy('name')->get();

        return Inertia::render('gallery/artworks/edit', [
            'artwork' => $artwork->load('artist'),
            'artists' => $artists,
        ]);
    }

    public function update(Request $request, Artwork $artwork): RedirectResponse
    {
        $user = $request->user();
        $gallery = $user->gallery;

        if (! $gallery || $artwork->gallery_id !== $gallery->id) {
            abort(403, 'You do not have permission to edit this artwork.');
        }

        $validated = $request->validate([
            'artist_id' => 'required|exists:artists,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'year' => 'nullable|integer|min:1000|max:'.(date('Y') + 1),
            'medium' => 'nullable|string|max:255',
            'dimensions' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'category' => 'nullable|string|max:255',
            'style' => 'nullable|string|max:255',
            'theme' => 'nullable|string|max:255',
            'image_url' => 'nullable|image|max:10240',
            'additional_images' => 'nullable|array',
            'additional_images.*' => 'image|max:10240',
        ]);

        // Handle main image upload
        if ($request->hasFile('image_url')) {
            // Delete old image
            if ($artwork->featured_image) {
                Storage::disk('public')->delete($artwork->featured_image);
            }
            $validated['featured_image'] = $request->file('image_url')->store('artworks', 'public');
            unset($validated['image_url']);
        }

        // Handle additional images upload
        if ($request->hasFile('additional_images')) {
            // Delete old additional images
            if ($artwork->additional_images) {
                foreach ($artwork->additional_images as $oldImage) {
                    Storage::disk('public')->delete($oldImage);
                }
            }
            $additionalImages = [];
            foreach ($request->file('additional_images') as $image) {
                $additionalImages[] = $image->store('artworks', 'public');
            }
            $validated['additional_images'] = $additionalImages;
        }

        // Handle price - set both price_min and price_max to the same value
        if (isset($validated['price']) && $validated['price']) {
            $validated['price_min'] = $validated['price'];
            $validated['price_max'] = $validated['price'];
            unset($validated['price']);
        }

        $artwork->update($validated);

        return redirect()->route('gallery.artworks.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Artwork updated successfully.',
            ]);
    }

    public function destroy(Request $request, Artwork $artwork): RedirectResponse
    {
        $user = $request->user();
        $gallery = $user->gallery;

        if (! $gallery || $artwork->gallery_id !== $gallery->id) {
            abort(403, 'You do not have permission to delete this artwork.');
        }

        // Delete images
        if ($artwork->featured_image) {
            Storage::disk('public')->delete($artwork->featured_image);
        }
        if ($artwork->additional_images) {
            foreach ($artwork->additional_images as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $artwork->delete();

        return redirect()->route('gallery.artworks.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Artwork deleted successfully.',
            ]);
    }
}
