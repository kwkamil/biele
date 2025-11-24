<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Inquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'company',
        'message',
        'artwork_ids',
        'status',
        'email_verified_at',
        'verification_token',
    ];

    protected $casts = [
        'artwork_ids' => 'array',
        'email_verified_at' => 'datetime',
    ];

    public function logs(): HasMany
    {
        return $this->hasMany(InquiryLog::class);
    }

    public function getFullNameAttribute(): string
    {
        return $this->first_name.' '.$this->last_name;
    }

    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeVerified($query)
    {
        return $query->where('status', 'verified');
    }

    public function scopePendingVerification($query)
    {
        return $query->where('status', 'pending_verification');
    }

    public function isVerified(): bool
    {
        return $this->status === 'verified' && $this->email_verified_at !== null;
    }

    public function isPendingVerification(): bool
    {
        return $this->status === 'pending_verification';
    }

    public function generateVerificationToken(): string
    {
        $this->verification_token = Str::random(60);
        $this->save();

        return $this->verification_token;
    }

    public function markAsVerified(): bool
    {
        $this->status = 'verified';
        $this->email_verified_at = Carbon::now();
        $this->verification_token = null;

        return $this->save();
    }

    public function getArtworks()
    {
        return Artwork::whereIn('id', $this->artwork_ids)
            ->with(['artist', 'gallery'])
            ->get();
    }
}
