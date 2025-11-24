<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artist;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArtistController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Artist::query()->withCount('artworks');

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('biography', 'like', "%{$search}%");
            });
        }

        $artists = $query->latest()->paginate(20);

        return Inertia::render('admin/artists/index', [
            'artists' => $artists,
            'filters' => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/artists/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'biography' => 'nullable|string',
            'photo' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('artists', 'public');
        }

        Artist::create($validated);

        return redirect()->route('admin.artists.index')
            ->with('success', 'Artist created successfully.');
    }

    public function edit(Artist $artist): Response
    {
        return Inertia::render('admin/artists/edit', [
            'artist' => $artist->load('artworks'),
        ]);
    }

    public function update(Request $request, Artist $artist): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'biography' => 'nullable|string',
            'photo' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($artist->photo && \Storage::disk('public')->exists($artist->photo)) {
                \Storage::disk('public')->delete($artist->photo);
            }
            $validated['photo'] = $request->file('photo')->store('artists', 'public');
        } else {
            // Keep existing photo if no new file uploaded
            unset($validated['photo']);
        }

        $artist->update($validated);

        return redirect()->route('admin.artists.index')
            ->with('success', 'Artist updated successfully.');
    }

    public function destroy(Artist $artist): RedirectResponse
    {
        $artist->delete();

        return redirect()->route('admin.artists.index')
            ->with('success', 'Artist deleted successfully.');
    }
}
