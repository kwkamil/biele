<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if columns already exist and add them if they don't
        if (! Schema::hasColumn('inquiries', 'email_verified_at')) {
            Schema::table('inquiries', function (Blueprint $table) {
                $table->timestamp('email_verified_at')->nullable()->after('status');
            });
        }

        if (! Schema::hasColumn('inquiries', 'verification_token')) {
            Schema::table('inquiries', function (Blueprint $table) {
                $table->string('verification_token')->nullable()->after('email_verified_at');
            });
        }

        // First update the enum to include new values alongside old ones
        Schema::table('inquiries', function (Blueprint $table) {
            $table->enum('status', ['new', 'read', 'responded', 'pending_verification', 'verified'])
                ->default('pending_verification')
                ->change();
        });

        // Update existing inquiries - convert 'new' to 'verified' (assume old inquiries are valid)
        DB::table('inquiries')->where('status', 'new')->update(['status' => 'verified']);

        // Finally update enum to remove 'new' status
        Schema::table('inquiries', function (Blueprint $table) {
            $table->enum('status', ['pending_verification', 'verified', 'read', 'responded'])
                ->default('pending_verification')
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inquiries', function (Blueprint $table) {
            $table->dropColumn(['email_verified_at', 'verification_token']);

            // Revert status enum to original values
            $table->enum('status', ['new', 'read', 'responded'])
                ->default('new')
                ->change();
        });
    }
};
