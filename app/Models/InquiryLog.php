<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InquiryLog extends Model
{
    protected $fillable = [
        'inquiry_id',
        'action',
        'details',
    ];

    protected $casts = [
        'details' => 'array',
    ];

    public function inquiry(): BelongsTo
    {
        return $this->belongsTo(Inquiry::class);
    }
}
