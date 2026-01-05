<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, add the duplicate_key column without unique constraint
        Schema::table('documents', function (Blueprint $table) {
            $table->string('duplicate_key', 64)->after('document_type')->nullable();
        });

        // Generate duplicate_key for existing documents
        DB::table('documents')->orderBy('id')->chunk(100, function ($documents) {
            foreach ($documents as $document) {
                $doc = (array) $document;
                $duplicateKey = $this->generateDuplicateKey($doc);

                DB::table('documents')
                    ->where('id', $document->id)
                    ->update(['duplicate_key' => $duplicateKey]);
            }
        });

        // Now make it non-nullable and add unique index
        Schema::table('documents', function (Blueprint $table) {
            $table->string('duplicate_key', 64)->nullable(false)->change();
            $table->unique('duplicate_key');
        });

        // Rename verification_notes to verification_note
        Schema::table('documents', function (Blueprint $table) {
            $table->renameColumn('verification_notes', 'verification_note');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropUnique(['duplicate_key']);
            $table->dropColumn('duplicate_key');

            $table->renameColumn('verification_note', 'verification_notes');
        });
    }

    /**
     * Generate duplicate key from document metadata (copied from Document model).
     */
    private function generateDuplicateKey(array $data): string
    {
        $documentType = $data['document_type'];

        if ($documentType === 'nilai') {
            $key = implode('|', [
                'nilai',
                $data['tahun_ajaran'],
                $data['prodi'],
                $data['mata_kuliah'],
                $data['kelas'],
            ]);
        } else {
            $key = implode('|', [
                $documentType,
                $data['prodi'],
                $data['tahun_lulus'],
                $data['npm'],
            ]);
        }

        return sha1($key);
    }
};
