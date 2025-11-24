<?php

namespace App\Http\Controllers\Gallery;

use App\Http\Controllers\Controller;
use App\Models\Artist;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ArtistController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $gallery = $user->gallery;

        if (! $gallery) {
            abort(403, 'You do not have a gallery associated with your account.');
        }

        // Get all artists (galleries can add artists that others can use too)
        $artists = Artist::withCount('artworks')
            ->orderBy('name')
            ->paginate(20);

        return Inertia::render('gallery/artists/index', [
            'artists' => $artists,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('gallery/artists/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $gallery = $user->gallery;

        if (! $gallery) {
            abort(403, 'You do not have a gallery associated with your account.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'nationality' => 'nullable|string|max:255',
            'birth_year' => 'nullable|integer|min:1000|max:' . date('Y'),
            'death_year' => 'nullable|integer|min:1000|max:' . date('Y'),
            'photo_url' => 'nullable|image|max:10240',
        ]);

        // Generate slug from name
        $slug = Str::slug($validated['name']);

        // Check if artist with this slug already exists
        if (Artist::where('slug', $slug)->exists()) {
            return redirect()->back()
                ->withInput()
                ->withErrors(['name' => 'An artist with this name already exists.']);
        }

        $validated['slug'] = $slug;

        // Handle photo upload
        if ($request->hasFile('photo_url')) {
            $validated['photo_url'] = $request->file('photo_url')->store('artists', 'public');
        }

        Artist::create($validated);

        return redirect()->route('gallery.artists.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Artist created successfully.',
            ]);
    }

    public function edit(Artist $artist): Response
    {
        return Inertia::render('gallery/artists/edit', [
            'artist' => $artist,
        ]);
    }

    public function update(Request $request, Artist $artist): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'nationality' => 'nullable|string|max:255',
            'birth_year' => 'nullable|integer|min:1000|max:' . date('Y'),
            'death_year' => 'nullable|integer|min:1000|max:' . date('Y'),
            'photo_url' => 'nullable|image|max:10240',
        ]);

        // Generate slug from name
        $slug = Str::slug($validated['name']);

        // Check if artist with this slug already exists (excluding current artist)
        if (Artist::where('slug', $slug)->where('id', '!=', $artist->id)->exists()) {
            return redirect()->back()
                ->withInput()
                ->withErrors(['name' => 'An artist with this name already exists.']);
        }

        $validated['slug'] = $slug;

        // Handle photo upload
        if ($request->hasFile('photo_url')) {
            // Delete old photo
            if ($artist->photo_url) {
                Storage::disk('public')->delete($artist->photo_url);
            }
            $validated['photo_url'] = $request->file('photo_url')->store('artists', 'public');
        }

        $artist->update($validated);

        return redirect()->route('gallery.artists.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Artist updated successfully.',
            ]);
    }

    public function destroy(Artist $artist): RedirectResponse
    {
        // Check if artist has any artworks
        if ($artist->artworks()->count() > 0) {
            return redirect()->route('gallery.artists.index')
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Cannot delete artist with associated artworks. Please delete or reassign artworks first.',
                ]);
        }

        // Delete photo
        if ($artist->photo_url) {
            Storage::disk('public')->delete($artist->photo_url);
        }

        $artist->delete();

        return redirect()->route('gallery.artists.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Artist deleted successfully.',
            ]);
    }
}
