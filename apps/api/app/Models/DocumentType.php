<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentType extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'requires_verification',
    ];

    protected $casts = [
        'requires_verification' => 'boolean',
    ];
}
