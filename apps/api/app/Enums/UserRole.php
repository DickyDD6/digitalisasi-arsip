<?php

namespace App\Enums;

enum UserRole: string
{
    case MANAGER = 'manager';
    case UPLOADER = 'uploader';
    case QC = 'qc';
    case SBAP = 'sbap';

    /**
     * Get all role values as array.
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get role label for display.
     */
    public function label(): string
    {
        return match ($this) {
            self::MANAGER => 'Manager Arsip',
            self::UPLOADER => 'Tim Uploader',
            self::QC => 'Tim Quality Control',
            self::SBAP => 'Staff Biro Akademik',
        };
    }
}
