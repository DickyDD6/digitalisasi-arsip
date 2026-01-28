<?php

namespace App\Http\Requests;

use App\Enums\DocumentType;
use App\Enums\Prodi;
use App\Rules\ValidPdfFile;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UploadDocumentRequest extends FormRequest
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
        $rules = [
            'document_type' => ['required', Rule::enum(DocumentType::class)],
            'file' => ['required', 'file', 'mimes:pdf', 'max:5120', new ValidPdfFile()],
            'prodi' => ['required', Rule::enum(Prodi::class)],
        ];


        // Conditional validation based on document_type
        $documentType = $this->input('document_type');

        if ($documentType === 'nilai') {
            // Required fields for nilai documents
            $rules['tahun_ajaran'] = ['required', 'string', 'max:255'];
            $rules['mata_kuliah'] = ['required', 'string', 'max:255'];
            $rules['kelas'] = ['required', 'string', 'max:255'];
        } elseif (in_array($documentType, ['ijazah', 'transkrip', 'berita_acara_sidang'])) {
            // Required fields for ijazah/transkrip/berita acara sidang  documents
            $rules['tahun_lulus'] = ['required', 'string', 'max:255'];
            $rules['npm'] = ['required', 'string', 'max:255'];
        }

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
            'document_type.required' => 'Tipe dokumen wajib diisi.',
            'document_type.Illuminate\Validation\Rules\Enum' => 'Tipe dokumen tidak valid.',
            'file.required' => 'File dokumen wajib diunggah.',
            'file.file' => 'File yang diunggah tidak valid.',
            'file.mimes' => 'File harus berformat PDF.',
            'file.max' => 'Ukuran file maksimal 5MB.',
            'prodi.required' => 'Program studi wajib diisi.',
            'tahun_ajaran.required' => 'Tahun ajaran wajib diisi untuk dokumen nilai.',
            'mata_kuliah.required' => 'Mata kuliah wajib diisi untuk dokumen nilai.',
            'kelas.required' => 'Kelas wajib diisi untuk dokumen nilai.',
            'tahun_lulus.required' => 'Tahun lulus wajib diisi untuk dokumen ijazah/transkrip/berita acara sidang.',
            'npm.required' => 'NPM wajib diisi untuk dokumen ijazah/transkrip/berita acara sidang.',
        ];
    }

    /**
     * Get validated data with only relevant fields for the document type.
     *
     * @return array
     */
    public function validatedData(): array
    {
        $data = $this->validated();
        $documentType = $data['document_type'];

        // Remove irrelevant fields based on document type
        if ($documentType === 'nilai') {
            unset($data['tahun_lulus'], $data['npm']);
        } elseif (in_array($documentType, ['ijazah', 'transkrip', 'berita_acara_sidang'])) {
            unset($data['tahun_ajaran'], $data['mata_kuliah'], $data['kelas']);
        }

        return $data;
    }
}
