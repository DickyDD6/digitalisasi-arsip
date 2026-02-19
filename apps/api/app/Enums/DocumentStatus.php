<?php

namespace App\Enums;

enum DocumentStatus: string
{
    case PENDING = 'menunggu verifikasi';
    case VERIFIED = 'terverifikasi';
    case REJECTED = 'tidak terverifikasi';

    /**
     * Get all status values as array.
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get status label for display.
     */
    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Menunggu Verifikasi',
            self::VERIFIED => 'Terverifikasi',
            self::REJECTED => 'Tidak Terverifikasi',
        };
    }

    /**
     * Get status color for UI.
     */
    public function color(): string
    {
        return match ($this) {
            self::PENDING => 'yellow',
            self::VERIFIED => 'green',
            self::REJECTED => 'red',
        };
    }
}
