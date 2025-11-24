<?php

use App\Http\Controllers\Api\ArtistController;
use App\Http\Controllers\Api\ArtworkController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\InquiryController;
use App\Http\Controllers\Api\SavedArtworkController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public catalog routes
Route::apiResource('artworks', ArtworkController::class)
    ->only(['index', 'show'])
    ->parameters(['artworks' => 'slug']);

Route::apiResource('artists', ArtistController::class)
    ->only(['index', 'show'])
    ->parameters(['artists' => 'slug']);

Route::apiResource('galleries', GalleryController::class)
    ->only(['index', 'show'])
    ->parameters(['galleries' => 'slug']);

// Saved artworks (schowek)
Route::post('saved-artworks', [SavedArtworkController::class, 'store']);
Route::delete('saved-artworks/{artwork}', [SavedArtworkController::class, 'destroy']);
Route::get('saved-artworks', [SavedArtworkController::class, 'index']);

// Inquiries
Route::post('inquiries', [InquiryController::class, 'store']);
