<?php

namespace App\Enums;

enum DocumentType: string
{
    case NILAI = 'nilai'; // Nilai Mata Kuliah
    case IJAZAH = 'ijazah';
    case TRANSKRIP = 'transkrip';
    case BERITA_ACARA_SIDANG = 'berita_acara_sidang';

    /**
     * Get all document type values as array.
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get document type label for display.
     */
    public function label(): string
    {
        return match ($this) {
            self::NILAI => 'Nilai Mata Kuliah',
            self::IJAZAH => 'Ijazah',
            self::TRANSKRIP => 'Transkrip Nilai',
            self::BERITA_ACARA_SIDANG => 'Berita Acara Sidang',
        };
    }
}
