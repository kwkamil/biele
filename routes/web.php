<?php

use App\Http\Controllers\Web\CatalogController;
use App\Http\Controllers\Web\InquiryController;
use Illuminate\Support\Facades\Route;

Route::get('/', [CatalogController::class, 'index'])->name('home');
Route::get('/catalog', [CatalogController::class, 'index'])->name('catalog');
Route::get('/artworks/{slug}', [CatalogController::class, 'artwork'])->name('artwork.show');
Route::get('/artists', [CatalogController::class, 'artists'])->name('artists');
Route::get('/artists/{slug}', [CatalogController::class, 'artist'])->name('artist.show');
Route::get('/galleries', [CatalogController::class, 'galleries'])->name('galleries');
Route::get('/saved', [CatalogController::class, 'saved'])->name('saved');

// Inquiry verification routes
Route::get('/inquiry/verify/{inquiry}', [InquiryController::class, 'verify'])
    ->name('inquiry.verify')
    ->middleware('signed');

Route::get('/api/inquiries/{inquiry}/status', [InquiryController::class, 'status'])
    ->name('inquiry.status');

// Admin root redirect
Route::get('/admin', function () {
    return redirect()->route('admin.dashboard');
})->middleware(['auth', 'verified']);

// Gallery panel routes
Route::middleware(['auth', 'verified'])->prefix('gallery')->name('gallery.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Gallery\DashboardController::class, 'index'])
        ->name('dashboard');

    Route::resource('artworks', \App\Http\Controllers\Gallery\ArtworkController::class)
        ->except(['show']);

    Route::resource('artists', \App\Http\Controllers\Gallery\ArtistController::class)
        ->except(['show']);

    Route::get('/inquiries', [\App\Http\Controllers\Gallery\InquiryController::class, 'index'])
        ->name('inquiries.index');
    Route::get('/inquiries/{inquiry}', [\App\Http\Controllers\Gallery\InquiryController::class, 'show'])
        ->name('inquiries.show');
});

// Admin routes
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])
        ->name('dashboard');

    Route::resource('artists', \App\Http\Controllers\Admin\ArtistController::class)
        ->except(['show']);

    Route::resource('galleries', \App\Http\Controllers\Admin\GalleryController::class)
        ->except(['show']);
    Route::post('/galleries/{gallery}/approve', [\App\Http\Controllers\Admin\GalleryController::class, 'approve'])
        ->name('galleries.approve');
    Route::post('/galleries/{gallery}/reject', [\App\Http\Controllers\Admin\GalleryController::class, 'reject'])
        ->name('galleries.reject');

    Route::resource('artworks', \App\Http\Controllers\Admin\ArtworkController::class)
        ->except(['show']);
    Route::post('/artworks/{artwork}/approve', [\App\Http\Controllers\Admin\ArtworkController::class, 'approve'])
        ->name('artworks.approve');
    Route::post('/artworks/{artwork}/reject', [\App\Http\Controllers\Admin\ArtworkController::class, 'reject'])
        ->name('artworks.reject');

    Route::resource('inquiries', \App\Http\Controllers\Admin\InquiryController::class)
        ->only(['index', 'show', 'edit', 'update', 'destroy']);

    Route::resource('users', \App\Http\Controllers\Admin\UserController::class)
        ->except(['show']);

    Route::get('/action-logs', [\App\Http\Controllers\Admin\ActionLogController::class, 'index'])
        ->name('action-logs.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
