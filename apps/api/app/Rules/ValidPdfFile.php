<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;

class ValidPdfFile implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!$value instanceof UploadedFile) {
            $fail('File tidak valid.');
            return;
        }

        // Check if file exists and is readable
        if (!file_exists($value->getRealPath()) || !is_readable($value->getRealPath())) {
            $fail('File tidak dapat dibaca.');
            return;
        }

        // Check PDF magic number (signature)
        // Valid PDF files must start with %PDF- (25 50 44 46 2D in hex)
        $handle = fopen($value->getRealPath(), 'rb');

        if ($handle === false) {
            $fail('Tidak dapat membuka file untuk validasi.');
            return;
        }

        $header = fread($handle, 5);
        fclose($handle);

        if ($header !== '%PDF-') {
            $fail('File bukan PDF yang valid. File mungkin rusak atau berbahaya.');
        }
    }
}
