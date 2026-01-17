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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();

            // Document type and metadata
            $table->string('document_type', 50); // nilai, transkrip, ijazah
            $table->string('file_path');
            $table->string('file_name');
            $table->unsignedBigInteger('file_size'); // File size in bytes

            // Common metadata untuk semua jenis dokumen
            $table->string('prodi', 100);

            // Metadata untuk document_type=nilai
            $table->string('tahun_ajaran', 20)->nullable();
            $table->string('mata_kuliah', 100)->nullable();
            $table->string('kelas', 20)->nullable();

            // Metadata untuk document_type=ijazah/transkrip
            $table->string('tahun_lulus', 20)->nullable();
            $table->string('npm', 50)->nullable();

            // Status workflow
            $table->string('status', 50)->default('menunggu_verifikasi'); // menunggu_verifikasi, terverifikasi, tidak_terverifikasi
            $table->text('verification_notes')->nullable();

            // User tracking
            $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();

            $table->timestamps();

            // Indexes for performance
            $table->index('document_type');
            $table->index('status');
            $table->index(['uploaded_by', 'created_at']);
            $table->index(['verified_by', 'verified_at']);
            $table->index(['prodi', 'document_type']);

            // Note: Unique constraints removed to avoid MySQL key length limit (3072 bytes)
            // Duplicate checking will be handled in application logic (DocumentService)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
