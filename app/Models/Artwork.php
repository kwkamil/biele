<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Artwork extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'artist_id',
        'gallery_id',
        'category',
        'style',
        'theme',
        'price_min',
        'price_max',
        'medium',
        'dimensions',
        'description',
        'featured_image',
        'additional_images',
        'is_approved',
        'approved_at',
    ];

    protected $casts = [
        'additional_images' => 'array',
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
        'price_min' => 'decimal:2',
        'price_max' => 'decimal:2',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($artwork) {
            if (empty($artwork->slug)) {
                $artwork->slug = Str::slug($artwork->title.'-'.Str::random(6));
            }
        });
    }

    public function artist(): BelongsTo
    {
        return $this->belongsTo(Artist::class);
    }

    public function gallery(): BelongsTo
    {
        return $this->belongsTo(Gallery::class);
    }

    public function savedArtworks(): HasMany
    {
        return $this->hasMany(SavedArtwork::class);
    }

    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopeActiveGallery($query)
    {
        return $query->whereHas('gallery', function ($query) {
            $query->where('status', 'active');
        });
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['category'] ?? false, fn ($query, $category) => $query->where('category', $category)
        );

        $query->when($filters['style'] ?? false, fn ($query, $style) => $query->where('style', $style)
        );

        $query->when($filters['theme'] ?? false, fn ($query, $theme) => $query->where('theme', $theme)
        );

        $query->when($filters['artist_id'] ?? false, fn ($query, $artistId) => $query->where('artist_id', $artistId)
        );

        $query->when($filters['price_min'] ?? false, fn ($query, $price) => $query->where('price_min', '>=', $price)
        );

        $query->when($filters['price_max'] ?? false, fn ($query, $price) => $query->where('price_max', '<=', $price)
        );
    }
}
