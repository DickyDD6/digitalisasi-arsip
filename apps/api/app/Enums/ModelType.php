<?php

namespace App\Enums;

enum ModelType: string
{
    case USER = 'App\Models\User';
    case DOCUMENT = 'App\Models\Document';

    /**
     * Get the label for the model type.
     */
    public function label(): string
    {
        return match ($this) {
            self::USER => 'Pengguna',
            self::DOCUMENT => 'Dokumen',
        };
    }
}
