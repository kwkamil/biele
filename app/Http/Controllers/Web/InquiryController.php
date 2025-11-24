<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Mail\InquiryNotification;
use App\Models\ActionLog;
use App\Models\Inquiry;
use App\Models\InquiryLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class InquiryController extends Controller
{
    public function verify(Request $request, Inquiry $inquiry)
    {
        // Check if the request has a valid signature
        if (! $request->hasValidSignature()) {
            return Inertia::render('inquiry-verification-error', [
                'error' => 'Link weryfikacyjny jest nieprawidłowy lub wygasł.',
            ]);
        }

        // Check if inquiry is already verified
        if ($inquiry->isVerified()) {
            return Inertia::render('inquiry-verification-success', [
                'inquiry' => $inquiry,
                'message' => 'Twoje zapytanie zostało już wcześniej potwierdzone.',
            ]);
        }

        // Check if verification token matches
        $token = $request->get('token');
        if (! $token || $inquiry->verification_token !== $token) {
            return Inertia::render('inquiry-verification-error', [
                'error' => 'Token weryfikacyjny jest nieprawidłowy.',
            ]);
        }

        // Mark inquiry as verified
        $inquiry->markAsVerified();

        // Log the verification
        InquiryLog::create([
            'inquiry_id' => $inquiry->id,
            'action' => 'email_verified',
            'details' => [
                'verified_at' => now(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ],
        ]);

        // Log to action log
        ActionLog::log(
            action: 'inquiry_verified',
            subject: $inquiry,
            details: [
                'email' => $inquiry->email,
                'first_name' => $inquiry->first_name,
                'last_name' => $inquiry->last_name,
            ]
        );

        // Send notification email to galleries
        $artworks = $inquiry->getArtworks();

        // Group artworks by gallery
        $artworksByGallery = $artworks->groupBy('gallery_id');

        // Send email to each gallery that has artworks in this inquiry
        foreach ($artworksByGallery as $galleryId => $galleryArtworks) {
            $gallery = $galleryArtworks->first()->gallery;

            if ($gallery && $gallery->user && $gallery->user->email) {
                Mail::to($gallery->user->email)
                    ->send(new InquiryNotification($inquiry, $galleryArtworks));

                // Log the notification
                InquiryLog::create([
                    'inquiry_id' => $inquiry->id,
                    'action' => 'notification_sent',
                    'details' => [
                        'sent_to' => $gallery->user->email,
                        'gallery_id' => $galleryId,
                        'gallery_name' => $gallery->name,
                        'artwork_count' => $galleryArtworks->count(),
                        'sent_at' => now(),
                    ],
                ]);

                // Log to action log
                ActionLog::log(
                    action: 'inquiry_notification_sent',
                    subject: $inquiry,
                    details: [
                        'gallery_id' => $galleryId,
                        'gallery_name' => $gallery->name,
                        'gallery_email' => $gallery->user->email,
                        'artwork_count' => $galleryArtworks->count(),
                    ],
                    userId: $gallery->user_id
                );
            }
        }

        return Inertia::render('inquiry-verification-success', [
            'inquiry' => $inquiry,
            'artworks' => $artworks,
            'message' => 'Twoje zapytanie zostało pomyślnie potwierdzone! Galeria otrzymała powiadomienie i wkrótce się z Tobą skontaktuje.',
        ]);
    }

    public function status(Request $request, Inquiry $inquiry)
    {
        return response()->json([
            'id' => $inquiry->id,
            'status' => $inquiry->status,
            'is_verified' => $inquiry->isVerified(),
            'is_pending_verification' => $inquiry->isPendingVerification(),
            'verified_at' => $inquiry->email_verified_at,
        ]);
    }
}
