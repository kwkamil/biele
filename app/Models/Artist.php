<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Artist extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'photo',
        'biography',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($artist) {
            if (empty($artist->slug)) {
                $artist->slug = Str::slug($artist->name);
            }
        });
    }

    public function artworks(): HasMany
    {
        return $this->hasMany(Artwork::class);
    }
}
