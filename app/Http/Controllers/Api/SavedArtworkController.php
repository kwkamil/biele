<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artwork;
use App\Models\SavedArtwork;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SavedArtworkController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $sessionId = $request->session()->getId();
        $userId = $request->user()?->id;

        $query = SavedArtwork::with(['artwork.artist', 'artwork.gallery']);

        if ($userId) {
            $query->where('user_id', $userId);
        } else {
            $query->where('session_id', $sessionId);
        }

        $savedArtworks = $query->get();

        return response()->json([
            'data' => $savedArtworks,
            'count' => $savedArtworks->count(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'artwork_id' => 'required|exists:artworks,id',
        ]);

        $sessionId = $request->session()->getId();
        $userId = $request->user()?->id;
        $artworkId = $request->artwork_id;

        // Check if artwork is approved
        $artwork = Artwork::approved()->findOrFail($artworkId);

        // Check if already saved
        $exists = SavedArtwork::where('artwork_id', $artworkId)
            ->where(function ($query) use ($userId, $sessionId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('session_id', $sessionId);
                }
            })
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Dzieło jest już w schowku',
            ], 422);
        }

        $savedArtwork = SavedArtwork::create([
            'artwork_id' => $artworkId,
            'user_id' => $userId,
            'session_id' => $userId ? null : $sessionId,
        ]);

        $savedArtwork->load(['artwork.artist', 'artwork.gallery']);

        return response()->json([
            'message' => 'Dzieło zostało dodane do schowka',
            'data' => $savedArtwork,
        ], 201);
    }

    public function destroy(Request $request, Artwork $artwork): JsonResponse
    {
        $sessionId = $request->session()->getId();
        $userId = $request->user()?->id;

        $savedArtwork = SavedArtwork::where('artwork_id', $artwork->id)
            ->where(function ($query) use ($userId, $sessionId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('session_id', $sessionId);
                }
            })
            ->first();

        if (! $savedArtwork) {
            return response()->json([
                'message' => 'Dzieło nie znajduje się w schowku',
            ], 404);
        }

        $savedArtwork->delete();

        return response()->json([
            'message' => 'Dzieło zostało usunięte ze schowka',
        ]);
    }
}
