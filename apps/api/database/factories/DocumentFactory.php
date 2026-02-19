<?php

namespace Database\Factories;

use App\Enums\DocumentStatus;
use App\Enums\DocumentType;
use App\Enums\Prodi;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Document;
use Illuminate\Support\Facades\Storage;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Document>
 */
class DocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $documentType = fake()->randomElement(DocumentType::cases())->value;

        $data = [
            'document_type' => $documentType,
            'file_path' => $this->getRandomExistingFile(),
            'file_name' => fake()->word() . '.pdf',
            'file_size' => fake()->numberBetween(100000, 5000000),
            'prodi' => fake()->randomElement(Prodi::cases())->value,
            'status' => fake()->randomElement(DocumentStatus::cases())->value,
            'uploaded_by' => User::factory(),
        ];

        if ($documentType === 'nilai') {
            $data['tahun_ajaran'] = fake()->randomElement(['2022/2023', '2023/2024', '2024/2025']);
            $data['mata_kuliah'] = fake()->randomElement(['Pemrograman Web', 'Basis Data', 'Algoritma']);
            $data['kelas'] = fake()->randomElement(['A', 'B', 'C']);
        } else {
            $data['tahun_lulus'] = (string) fake()->year();
            $data['npm'] = fake()->numerify('########');
        }

        // Generate duplicate_key
        $data['duplicate_key'] = Document::generateDuplicateKey($data);

        return $data;
    }

    /**
     * Get random existing file from storage
     */
    private function getRandomExistingFile(): string
    {
        $allFiles = Storage::disk('public')->allFiles('archives');

        if (empty($allFiles)) {
            // Fallback jika belum ada file
            return 'archives/nilai/' . now()->format('Y/m') . '/dummy.pdf';
        }

        return $allFiles[array_rand($allFiles)];
    }

    /**
     * Indicate that the document is verified.
     */
    public function verified(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => DocumentStatus::VERIFIED->value,
            'verified_by' => User::factory(),
            'verified_at' => now(),
        ]);
    }

    /**
     * Indicate that the document is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => DocumentStatus::REJECTED->value,
            'verified_by' => User::factory(),
            'verified_at' => now(),
            'verification_note' => 'Dokumen tidak sesuai kriteria.',
        ]);
    }

    /**
     * Indicate that the document is pending.
     */
    public function pending(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => DocumentStatus::PENDING->value,
        ]);
    }
}
