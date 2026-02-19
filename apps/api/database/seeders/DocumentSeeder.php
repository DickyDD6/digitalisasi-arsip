<?php

namespace Database\Seeders;

use App\Enums\DocumentType;
use App\Models\Document;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure dummy files exist for each document type
        $dummyContent = '%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 4 0 R
>>
>>
/MediaBox [0 0 612 792]
/Contents 5 0 R
>>
endobj
4 0 obj
<<
/Type /Font
/Subtype /Type1
/Name /F1
/BaseFont /Helvetica
>>
endobj
5 0 obj
<<
/Length 44
>>
stream
BT
70 700 TD
/F1 24 Tf
(Hello World - Dummy PDF for Testing) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000010 00000 n
0000000079 00000 n
0000000173 00000 n
0000000301 00000 n
0000000380 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
492
%%EOF';

        foreach (DocumentType::cases() as $type) {
            $directory = 'archives/' . $type->value;
            $filePath = $directory . '/test.pdf';

            // Create directory if not exists
            if (!Storage::exists($directory)) {
                Storage::makeDirectory($directory);
            }

            // Create dummy PDF if not exists
            if (!Storage::exists($filePath)) {
                Storage::put($filePath, $dummyContent);
                $this->command->info("Created dummy PDF at: {$filePath}");
            }
        }

        // Get existing users
        $users = \App\Models\User::all();
        if ($users->isEmpty()) {
            $users = \App\Models\User::factory(5)->create();
        }

        // Create documents
        foreach (DocumentType::cases() as $type) {
            // Buat struktur folder sesuai dengan upload
            $directory = sprintf(
                'archives/%s/%s/%s',
                $type->value,
                now()->format('Y'),
                now()->format('m')
            );

            // Pastikan folder ada
            if (!Storage::disk('public')->exists($directory)) {
                Storage::disk('public')->makeDirectory($directory);
                $this->command->info("Created directory: {$directory}");
            }

            // Buat 3 dummy file untuk setiap type
            for ($i = 1; $i <= 3; $i++) {
                $filename = uniqid() . "_test_{$i}.pdf";
                $filePath = $directory . '/' . $filename;

                Storage::disk('public')->put($filePath, $dummyContent);
                $this->command->info("Created dummy PDF at: {$filePath}");
            }
        }

        // Create documents dengan file_path yang benar
        Document::factory()->count(20)->create([
            'uploaded_by' => fn() => $users->random()->id,
        ]);

        Document::factory()->verified()->count(10)->create([
            'uploaded_by' => fn() => $users->random()->id,
            'verified_by' => fn() => $users->random()->id,
        ]);

        Document::factory()->rejected()->count(5)->create([
            'uploaded_by' => fn() => $users->random()->id,
            'verified_by' => fn() => $users->random()->id,
        ]);

        Document::factory()->pending()->count(5)->create([
            'uploaded_by' => fn() => $users->random()->id,
        ]);

        $this->command->info('DocumentSeeder completed successfully.');
    }
}
