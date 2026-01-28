<?php

namespace App\Enums;

enum Prodi: string
{
    case INFORMATIKA = 'Teknik Informatika';
    case PANGAN = 'Teknologi Pangan';
    case INDUSTRI = 'Teknik Industri';
    case MESIN = 'Teknik Mesin';
    case LINGKUNGAN = 'Teknik Lingkungan';
    case PERENCANAAN_WILAYAH_KOTA = 'Perencanaan Wilayah dan Kota';

    /**
     * Get all prodi values as array.
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get prodi full name.
     */
    public function fullName(): string
    {
        return match ($this) {
            self::INFORMATIKA => 'Teknik Informatika',
            self::PANGAN => 'Teknologi Pangan',
            self::INDUSTRI => 'Teknik Industri',
            self::MESIN => 'Teknik Mesin',
            self::LINGKUNGAN => 'Teknik Lingkungan',
            self::PERENCANAAN_WILAYAH_KOTA => 'Perencanaan Wilayah dan Kota',
        };
    }
}
