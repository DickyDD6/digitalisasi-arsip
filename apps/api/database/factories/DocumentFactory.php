<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Document;

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
        $documentType = fake()->randomElement(['nilai', 'ijazah', 'transkrip']);

        $data = [
            'document_type' => $documentType,
            'file_path' => 'archives/' . $documentType . '/test.pdf',
            'file_name' => fake()->word() . '.pdf',
            'file_size' => fake()->numberBetween(100000, 5000000),
            'prodi' => fake()->randomElement(['Teknik Informatika', 'Sistem Informasi', 'Teknik Elektro']),
            'status' => fake()->randomElement(['menunggu_verifikasi', 'terverifikasi', 'tidak_terverifikasi']),
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
     * Indicate that the document is verified.
     */
    public function verified(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'terverifikasi',
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
            'status' => 'tidak_terverifikasi',
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
            'status' => 'menunggu_verifikasi',
        ]);
    }
}
