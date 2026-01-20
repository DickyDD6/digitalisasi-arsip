<?php

namespace App\Http\Requests;

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
            'document_type' => ['required', Rule::in(['nilai', 'transkrip', 'ijazah'])],
            'file' => ['required', 'file', 'mimes:pdf', 'max:5120', new ValidPdfFile()],
            'prodi' => ['required', 'string', 'max:255'],
        ];


        // Conditional validation based on document_type
        $documentType = $this->input('document_type');

        if ($documentType === 'nilai') {
            // Required fields for nilai documents
            $rules['tahun_ajaran'] = ['required', 'string', 'max:255'];
            $rules['mata_kuliah'] = ['required', 'string', 'max:255'];
            $rules['kelas'] = ['required', 'string', 'max:255'];
        } elseif (in_array($documentType, ['ijazah', 'transkrip'])) {
            // Required fields for ijazah/transkrip documents
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
            'document_type.in' => 'Tipe dokumen harus salah satu dari: nilai, transkrip, ijazah.',
            'file.required' => 'File dokumen wajib diunggah.',
            'file.file' => 'File yang diunggah tidak valid.',
            'file.mimes' => 'File harus berformat PDF.',
            'file.max' => 'Ukuran file maksimal 5MB.',
            'prodi.required' => 'Program studi wajib diisi.',
            'tahun_ajaran.required' => 'Tahun ajaran wajib diisi untuk dokumen nilai.',
            'mata_kuliah.required' => 'Mata kuliah wajib diisi untuk dokumen nilai.',
            'kelas.required' => 'Kelas wajib diisi untuk dokumen nilai.',
            'tahun_lulus.required' => 'Tahun lulus wajib diisi untuk dokumen ijazah/transkrip.',
            'npm.required' => 'NPM wajib diisi untuk dokumen ijazah/transkrip.',
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
        } elseif (in_array($documentType, ['ijazah', 'transkrip'])) {
            unset($data['tahun_ajaran'], $data['mata_kuliah'], $data['kelas']);
        }

        return $data;
    }
}
