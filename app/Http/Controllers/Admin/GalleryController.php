<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Gallery::query()
            ->with('user:id,name,email')
            ->withCount('artworks');

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
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

        $galleries = $query->latest()->paginate(20);

        return Inertia::render('admin/galleries/index', [
            'galleries' => $galleries,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        $users = User::where('role', 'gallery')->get(['id', 'name', 'email']);

        return Inertia::render('admin/galleries/create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_approved' => 'boolean',
            'status' => 'required|in:active,paused',
        ]);

        if ($validated['is_approved'] ?? false) {
            $validated['approved_at'] = now();
        }

        Gallery::create($validated);

        return redirect()->route('admin.galleries.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Gallery created successfully.',
            ]);
    }

    public function edit(Gallery $gallery): Response
    {
        $users = User::where('role', 'gallery')->get(['id', 'name', 'email']);

        return Inertia::render('admin/galleries/edit', [
            'gallery' => $gallery->load(['user', 'artworks']),
            'users' => $users,
        ]);
    }

    public function update(Request $request, Gallery $gallery): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_approved' => 'boolean',
            'status' => 'required|in:active,paused',
        ]);

        $wasApproved = $gallery->is_approved;
        $isNowApproved = $validated['is_approved'] ?? false;

        if (! $wasApproved && $isNowApproved) {
            $validated['approved_at'] = now();
        } elseif ($wasApproved && ! $isNowApproved) {
            $validated['approved_at'] = null;
        }

        $gallery->update($validated);

        return redirect()->route('admin.galleries.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Gallery updated successfully.',
            ]);
    }

    public function destroy(Gallery $gallery): RedirectResponse
    {
        $gallery->delete();

        return redirect()->route('admin.galleries.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Gallery deleted successfully.',
            ]);
    }

    public function approve(Gallery $gallery): RedirectResponse
    {
        $gallery->update([
            'is_approved' => true,
            'approved_at' => now(),
        ]);

        return redirect()->back()
            ->with('toast', [
                'type' => 'success',
                'message' => 'Gallery approved successfully.',
            ]);
    }

    public function reject(Gallery $gallery): RedirectResponse
    {
        $gallery->update([
            'is_approved' => false,
            'approved_at' => null,
        ]);

        return redirect()->back()
            ->with('toast', [
                'type' => 'success',
                'message' => 'Gallery approval rejected.',
            ]);
    }
}
