<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artist;
use App\Models\Artwork;
use App\Models\Gallery;
use App\Models\Inquiry;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'totalArtists' => Artist::count(),
            'totalGalleries' => Gallery::count(),
            'totalArtworks' => Artwork::count(),
            'totalInquiries' => Inquiry::count(),
            'totalUsers' => User::count(),
            'pendingInquiries' => Inquiry::where('status', 'pending_verification')->count(),
            'verifiedInquiries' => Inquiry::where('status', 'verified')->count(),
            'approvedArtworks' => Artwork::where('status', 'approved')->count(),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
        ]);
    }
}
