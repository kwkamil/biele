<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('galleries')->insert([
            'name' => 'Damian Gallery',
            'slug' => 'damian-gallery',
            'user_id' => 10,
            'description' => 'Gallery for Damian',
            'is_approved' => 1,
            'approved_at' => now(),
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('galleries')->where('user_id', 10)->delete();
    }
};
