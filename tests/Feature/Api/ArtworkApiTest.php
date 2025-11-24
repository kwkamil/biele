<?php

use App\Models\Artist;
use App\Models\Artwork;
use App\Models\Gallery;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can list approved artworks', function () {
    $user = User::factory()->create(['role' => 'gallery']);
    $gallery = Gallery::factory()->create(['user_id' => $user->id, 'is_approved' => true]);
    $artist = Artist::factory()->create();

    $approvedArtwork = Artwork::factory()->create([
        'artist_id' => $artist->id,
        'gallery_id' => $gallery->id,
        'is_approved' => true,
    ]);

    $unapprovedArtwork = Artwork::factory()->create([
        'artist_id' => $artist->id,
        'gallery_id' => $gallery->id,
        'is_approved' => false,
    ]);

    $response = $this->getJson('/api/artworks');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $approvedArtwork->id);
});

it('can show specific artwork by slug', function () {
    $user = User::factory()->create(['role' => 'gallery']);
    $gallery = Gallery::factory()->create(['user_id' => $user->id, 'is_approved' => true]);
    $artist = Artist::factory()->create();

    $artwork = Artwork::factory()->create([
        'artist_id' => $artist->id,
        'gallery_id' => $gallery->id,
        'is_approved' => true,
        'slug' => 'test-artwork',
    ]);

    $response = $this->getJson("/api/artworks/{$artwork->slug}");

    $response->assertOk()
        ->assertJsonPath('id', $artwork->id)
        ->assertJsonPath('title', $artwork->title)
        ->assertJsonStructure([
            'id', 'title', 'slug', 'artist' => ['id', 'name'],
            'gallery' => ['id', 'name'],
        ]);
});

it('returns 404 for unapproved artwork', function () {
    $user = User::factory()->create(['role' => 'gallery']);
    $gallery = Gallery::factory()->create(['user_id' => $user->id, 'is_approved' => true]);
    $artist = Artist::factory()->create();

    $artwork = Artwork::factory()->create([
        'artist_id' => $artist->id,
        'gallery_id' => $gallery->id,
        'is_approved' => false,
        'slug' => 'test-artwork',
    ]);

    $response = $this->getJson("/api/artworks/{$artwork->slug}");

    $response->assertNotFound();
});
