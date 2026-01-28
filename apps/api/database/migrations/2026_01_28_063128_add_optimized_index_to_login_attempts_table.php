<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('login_attempts', function (Blueprint $table) {
            // Add optimized composite index for getLockoutExpiry query
            // This index supports: WHERE email = ? AND failed_at >= ? ORDER BY failed_at DESC
            $table->index(['email', 'failed_at'], 'email_failed_at_optimized');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('login_attempts', function (Blueprint $table) {
            $table->dropIndex('email_failed_at_optimized');
        });
    }
};
