<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActionLog;
use App\Models\Artist;
use App\Models\Artwork;
use App\Models\Gallery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArtworkController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Artwork::query()
            ->with(['artist:id,name', 'gallery:id,name'])
            ->select('id', 'title', 'slug', 'artist_id', 'gallery_id', 'featured_image', 'price_min', 'price_max', 'is_approved', 'created_at');

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $status = $request->get('status');
            if ($status === 'approved') {
                $query->where('is_approved', true);
            } elseif ($status === 'pending') {
                $query->where('is_approved', false);
            }
        }

        if ($request->has('artist_id')) {
            $query->where('artist_id', $request->get('artist_id'));
        }

        if ($request->has('gallery_id')) {
            $query->where('gallery_id', $request->get('gallery_id'));
        }

        $artworks = $query->latest()->paginate(20);

        return Inertia::render('admin/artworks/index', [
            'artworks' => $artworks,
            'filters' => $request->only(['search', 'status', 'artist_id', 'gallery_id']),
        ]);
    }

    public function create(): Response
    {
        $artists = Artist::orderBy('name')->get(['id', 'name']);
        $galleries = Gallery::with('user:id,name')->orderBy('name')->get(['id', 'name', 'user_id']);

        return Inertia::render('admin/artworks/create', [
            'artists' => $artists,
            'galleries' => $galleries,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'artist_id' => 'required|exists:artists,id',
            'gallery_id' => 'required|exists:galleries,id',
            'category' => 'nullable|string|max:100',
            'style' => 'nullable|string|max:100',
            'theme' => 'nullable|string|max:100',
            'price_min' => 'nullable|numeric|min:0',
            'price_max' => 'nullable|numeric|min:0',
            'medium' => 'nullable|string|max:100',
            'dimensions' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'featured_image' => 'nullable|image|max:5120',
            'additional_images' => 'nullable|array',
            'additional_images.*' => 'image|max:5120',
            'is_approved' => 'boolean',
        ]);

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('artworks', 'public');
        }

        if ($request->hasFile('additional_images')) {
            $additionalPaths = [];
            foreach ($request->file('additional_images') as $image) {
                $additionalPaths[] = $image->store('artworks', 'public');
            }
            $validated['additional_images'] = $additionalPaths;
        }

        if ($validated['is_approved'] ?? false) {
            $validated['approved_at'] = now();
        }

        $artwork = Artwork::create($validated);

        // Log artwork creation
        ActionLog::log(
            action: 'artwork_created',
            subject: $artwork,
            details: [
                'title' => $artwork->title,
                'artist_id' => $artwork->artist_id,
                'gallery_id' => $artwork->gallery_id,
                'is_approved' => $artwork->is_approved,
            ]
        );

        return redirect()->route('admin.artworks.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Artwork created successfully.',
            ]);
    }

    public function edit(Artwork $artwork): Response
    {
        $artists = Artist::orderBy('name')->get(['id', 'name']);
        $galleries = Gallery::with('user:id,name')->orderBy('name')->get(['id', 'name', 'user_id']);

        return Inertia::render('admin/artworks/edit', [
            'artwork' => $artwork->load(['artist', 'gallery']),
            'artists' => $artists,
            'galleries' => $galleries,
        ]);
    }

    public function update(Request $request, Artwork $artwork): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'artist_id' => 'required|exists:artists,id',
            'gallery_id' => 'required|exists:galleries,id',
            'category' => 'nullable|string|max:100',
            'style' => 'nullable|string|max:100',
            'theme' => 'nullable|string|max:100',
            'price_min' => 'nullable|numeric|min:0',
            'price_max' => 'nullable|numeric|min:0',
            'medium' => 'nullable|string|max:100',
            'dimensions' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'featured_image' => 'nullable|image|max:5120',
            'additional_images' => 'nullable|array',
            'additional_images.*' => 'image|max:5120',
            'is_approved' => 'boolean',
        ]);

        if ($request->hasFile('featured_image')) {
            // Delete old featured image if exists
            if ($artwork->featured_image && \Storage::disk('public')->exists($artwork->featured_image)) {
                \Storage::disk('public')->delete($artwork->featured_image);
            }
            $validated['featured_image'] = $request->file('featured_image')->store('artworks', 'public');
        } else {
            unset($validated['featured_image']);
        }

        if ($request->hasFile('additional_images')) {
            // Delete old additional images if exists
            if ($artwork->additional_images) {
                foreach ($artwork->additional_images as $oldImage) {
                    if (\Storage::disk('public')->exists($oldImage)) {
                        \Storage::disk('public')->delete($oldImage);
                    }
                }
            }
            $additionalPaths = [];
            foreach ($request->file('additional_images') as $image) {
                $additionalPaths[] = $image->store('artworks', 'public');
            }
            $validated['additional_images'] = $additionalPaths;
        } else {
            unset($validated['additional_images']);
        }

        $wasApproved = $artwork->is_approved;
        $isNowApproved = $validated['is_approved'] ?? false;

        if (! $wasApproved && $isNowApproved) {
            $validated['approved_at'] = now();
        } elseif ($wasApproved && ! $isNowApproved) {
            $validated['approved_at'] = null;
        }

        $artwork->update($validated);

        // Log artwork update
        ActionLog::log(
            action: 'artwork_updated',
            subject: $artwork,
            details: [
                'title' => $artwork->title,
                'approval_changed' => $wasApproved !== $isNowApproved,
                'was_approved' => $wasApproved,
                'is_now_approved' => $isNowApproved,
            ]
        );

        return redirect()->route('admin.artworks.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Artwork updated successfully.',
            ]);
    }

    public function destroy(Artwork $artwork): RedirectResponse
    {
        // Log artwork deletion before deleting
        ActionLog::log(
            action: 'artwork_deleted',
            subject: $artwork,
            details: [
                'artwork_id' => $artwork->id,
                'title' => $artwork->title,
                'artist_id' => $artwork->artist_id,
                'gallery_id' => $artwork->gallery_id,
            ]
        );

        $artwork->delete();

        return redirect()->route('admin.artworks.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Artwork deleted successfully.',
            ]);
    }

    public function approve(Artwork $artwork): RedirectResponse
    {
        $artwork->update([
            'is_approved' => true,
            'approved_at' => now(),
        ]);

        // Log artwork approval
        ActionLog::log(
            action: 'artwork_approved',
            subject: $artwork,
            details: [
                'artwork_id' => $artwork->id,
                'title' => $artwork->title,
            ]
        );

        return redirect()->back()
            ->with('toast', [
                'type' => 'success',
                'message' => 'Artwork approved successfully.',
            ]);
    }

    public function reject(Artwork $artwork): RedirectResponse
    {
        $artwork->update([
            'is_approved' => false,
            'approved_at' => null,
        ]);

        // Log artwork rejection
        ActionLog::log(
            action: 'artwork_rejected',
            subject: $artwork,
            details: [
                'artwork_id' => $artwork->id,
                'title' => $artwork->title,
            ]
        );

        return redirect()->back()
            ->with('toast', [
                'type' => 'success',
                'message' => 'Artwork approval rejected.',
            ]);
    }
}
