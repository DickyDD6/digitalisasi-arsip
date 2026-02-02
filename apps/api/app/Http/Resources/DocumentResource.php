<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'document_type' => $this->document_type->value,
            'file_name' => $this->file_name,
            'file_size' => $this->file_size,
            'file_size_formatted' => $this->formatFileSize($this->file_size),

            // Metadata
            'prodi' => $this->prodi->value,
            'tahun_ajaran' => $this->tahun_ajaran,
            'mata_kuliah' => $this->mata_kuliah,
            'kelas' => $this->kelas,
            'tahun_lulus' => $this->tahun_lulus,
            'npm' => $this->npm,

            // Status
            'status' => $this->status->value,
            'verification_note' => $this->verification_note,

            // User tracking - SIMPLIFIED (only send names)
            'uploaded_by_name' => $this->uploader->name,
            'verified_by_name' => $this->verified_by ? $this->verifier->name : null,
            'verified_at' => $this->verified_at?->toISOString(),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * Format file size to human readable format.
     *
     * @param int $bytes
     * @return string
     */
    protected function formatFileSize(int $bytes): string
    {
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        }

        return $bytes . ' bytes';
    }
}
