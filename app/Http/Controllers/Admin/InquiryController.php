<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActionLog;
use App\Models\Inquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InquiryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Inquiry::query()->with('logs');

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        $inquiries = $query->latest()->paginate(20);

        return Inertia::render('admin/inquiries/index', [
            'inquiries' => $inquiries,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(Inquiry $inquiry): Response
    {
        $inquiry->load('logs');
        $artworks = $inquiry->getArtworks();

        return Inertia::render('admin/inquiries/show', [
            'inquiry' => $inquiry,
            'artworks' => $artworks,
        ]);
    }

    public function edit(Inquiry $inquiry): Response
    {
        $inquiry->load('logs');
        $artworks = $inquiry->getArtworks();

        return Inertia::render('admin/inquiries/edit', [
            'inquiry' => $inquiry,
            'artworks' => $artworks,
        ]);
    }

    public function update(Request $request, Inquiry $inquiry): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending_verification,verified,contacted,completed,cancelled',
        ]);

        $oldStatus = $inquiry->status;
        $inquiry->update($validated);

        // Log status change
        ActionLog::log(
            action: 'inquiry_status_updated',
            subject: $inquiry,
            details: [
                'old_status' => $oldStatus,
                'new_status' => $validated['status'],
                'inquiry_email' => $inquiry->email,
            ]
        );

        return redirect()->route('admin.inquiries.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Inquiry updated successfully.',
            ]);
    }

    public function destroy(Inquiry $inquiry): RedirectResponse
    {
        // Log deletion before deleting
        ActionLog::log(
            action: 'inquiry_deleted',
            subject: $inquiry,
            details: [
                'inquiry_id' => $inquiry->id,
                'email' => $inquiry->email,
                'first_name' => $inquiry->first_name,
                'last_name' => $inquiry->last_name,
                'status' => $inquiry->status,
            ]
        );

        $inquiry->delete();

        return redirect()->route('admin.inquiries.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Inquiry deleted successfully.',
            ]);
    }
}
