<?php

use App\Mail\InquiryConfirmation;
use App\Models\Artwork;
use App\Models\Inquiry;
use Illuminate\Support\Facades\Mail;

test('inquiry is created with pending verification status', function () {
    Mail::fake();

    $artwork = Artwork::factory()->create(['approved_at' => now()]);

    $response = $this->postJson('/api/inquiries', [
        'first_name' => 'Jan',
        'last_name' => 'Kowalski',
        'email' => 'jan@example.com',
        'artwork_ids' => [$artwork->id],
    ]);

    $response->assertStatus(201)
        ->assertJson([
            'data' => [
                'status' => 'pending_verification',
                'requires_verification' => true,
            ],
        ]);

    expect(Inquiry::where('email', 'jan@example.com')->first())
        ->status->toBe('pending_verification');

    Mail::assertSent(InquiryConfirmation::class);
});

test('inquiry can be verified with valid signed link', function () {
    $inquiry = Inquiry::factory()->create([
        'status' => 'pending_verification',
        'verification_token' => 'test-token-123',
    ]);

    $verificationUrl = \Illuminate\Support\Facades\URL::temporarySignedRoute(
        'inquiry.verify',
        now()->addHour(),
        ['inquiry' => $inquiry->id, 'token' => 'test-token-123']
    );

    $response = $this->get($verificationUrl);

    $response->assertStatus(200);

    $inquiry->refresh();
    expect($inquiry)
        ->status->toBe('verified')
        ->email_verified_at->not->toBeNull()
        ->verification_token->toBeNull();
});

test('inquiry verification fails with invalid token', function () {
    $inquiry = Inquiry::factory()->create([
        'status' => 'pending_verification',
        'verification_token' => 'test-token-123',
    ]);

    $verificationUrl = \Illuminate\Support\Facades\URL::temporarySignedRoute(
        'inquiry.verify',
        now()->addHour(),
        ['inquiry' => $inquiry->id, 'token' => 'wrong-token']
    );

    $response = $this->get($verificationUrl);

    $response->assertStatus(200);

    $inquiry->refresh();
    expect($inquiry)
        ->status->toBe('pending_verification')
        ->email_verified_at->toBeNull();
});
