<?php

namespace App\Http\Requests;

use App\Enums\DocumentType;
use App\Enums\Prodi;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by Policy
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Get current document type for conditional validation
        $document = $this->route('document');
        $documentType = $document?->document_type;

        $rules = [
            'prodi' => ['sometimes', Rule::enum(Prodi::class)],
        ];

        // Conditional validation based on document_type
        if ($documentType === DocumentType::NILAI) {
            // Required fields for nilai documents
            $rules['tahun_ajaran'] = ['sometimes', 'string', 'max:255'];
            $rules['mata_kuliah'] = ['sometimes', 'string', 'max:255'];
            $rules['kelas'] = ['sometimes', 'string', 'max:255'];
        } elseif (in_array($documentType, [DocumentType::IJAZAH, DocumentType::TRANSKRIP, DocumentType::BERITA_ACARA_SIDANG])) {
            // Required fields for ijazah/transkrip/berita acara sidang documents
            $rules['tahun_lulus'] = ['sometimes', 'string', 'max:255'];
            $rules['npm'] = ['sometimes', 'string', 'max:255'];
        }

        // Explicitly deny certain fields
        $rules['file'] = ['prohibited'];
        $rules['document_type'] = ['prohibited'];

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'prodi.string' => 'Prodi harus berupa teks.',
            'prodi.max' => 'Prodi maksimal 255 karakter.',
            'tahun_ajaran.string' => 'Tahun ajaran harus berupa teks.',
            'tahun_ajaran.max' => 'Tahun ajaran maksimal 255 karakter.',
            'mata_kuliah.string' => 'Mata kuliah harus berupa teks.',
            'mata_kuliah.max' => 'Mata kuliah maksimal 255 karakter.',
            'kelas.string' => 'Kelas harus berupa teks.',
            'kelas.max' => 'Kelas maksimal 255 karakter.',
            'tahun_lulus.string' => 'Tahun lulus harus berupa teks.',
            'tahun_lulus.max' => 'Tahun lulus maksimal 255 karakter.',
            'npm.string' => 'NPM harus berupa teks.',
            'npm.max' => 'NPM maksimal 255 karakter.',
            'file.prohibited' => 'File tidak dapat diubah. Upload dokumen baru jika ingin mengganti file.',
            'document_type.prohibited' => 'Tipe dokumen tidak dapat diubah.',
        ];
    }
}
