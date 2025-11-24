<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\InquiryConfirmation;
use App\Models\ActionLog;
use App\Models\Artwork;
use App\Models\Inquiry;
use App\Models\InquiryLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

class InquiryController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'company' => 'nullable|string|max:255',
            'message' => 'nullable|string|max:2000',
            'artwork_ids' => 'required|array|min:1',
            'artwork_ids.*' => 'exists:artworks,id',
        ]);

        // Verify that all artworks are approved
        $artworks = Artwork::approved()
            ->whereIn('id', $validated['artwork_ids'])
            ->get();

        if ($artworks->count() !== count($validated['artwork_ids'])) {
            return response()->json([
                'message' => 'Niektóre dzieła nie są dostępne',
            ], 422);
        }

        // Create inquiry with pending verification status
        $validated['status'] = 'pending_verification';
        $inquiry = Inquiry::create($validated);

        // Generate verification token
        $token = $inquiry->generateVerificationToken();

        // Generate signed verification URL (24 hours expiration)
        $verificationUrl = URL::temporarySignedRoute(
            'inquiry.verify',
            now()->addHours(24),
            ['inquiry' => $inquiry->id, 'token' => $token]
        );

        // Log creation
        InquiryLog::create([
            'inquiry_id' => $inquiry->id,
            'action' => 'created',
            'details' => [
                'user_agent' => $request->userAgent(),
                'ip_address' => $request->ip(),
                'verification_sent' => true,
            ],
        ]);

        // Log to action log
        ActionLog::log(
            action: 'inquiry_created',
            subject: $inquiry,
            details: [
                'email' => $inquiry->email,
                'first_name' => $inquiry->first_name,
                'last_name' => $inquiry->last_name,
                'artwork_count' => count($validated['artwork_ids']),
            ]
        );

        // Send confirmation email with verification link
        try {
            Mail::to($inquiry->email)->send(new InquiryConfirmation($inquiry, $verificationUrl));
            \Log::info('Inquiry confirmation email sent', ['inquiry_id' => $inquiry->id, 'email' => $inquiry->email]);
        } catch (\Exception $e) {
            \Log::error('Failed to send inquiry confirmation email', [
                'inquiry_id' => $inquiry->id,
                'email' => $inquiry->email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            // Don't fail the request, but log the error
        }

        return response()->json([
            'message' => 'Zapytanie zostało utworzone. Sprawdź swoją pocztę e-mail i kliknij link weryfikacyjny, aby potwierdzić zapytanie.',
            'data' => [
                'inquiry_id' => $inquiry->id,
                'status' => $inquiry->status,
                'requires_verification' => true,
            ],
        ], 201);
    }
}
