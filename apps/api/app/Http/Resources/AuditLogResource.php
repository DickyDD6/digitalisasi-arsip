<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuditLogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $actionEnum = \App\Enums\AuditAction::tryFrom($this->action);

        return [
            'id' => $this->id,
            'user' => [
                'name' => $this->user?->name ?? 'System',
                'role' => $this->user?->role ?? 'System',
            ],
            'action' => [
                'name' => $this->action,
                'label' => $actionEnum?->label() ?? $this->action,
                'color' => $actionEnum?->color() ?? 'secondary',
            ],
            'document' => [
                'id_formatted' => $this->model_type === \App\Enums\ModelType::DOCUMENT->value ? 'DOC-' . $this->model_id : '-',
                'name' => $this->metadata['file_name'] ?? '-',
            ],
            'description' => $this->description,
            'ip_address' => $this->ip_address,
            'date' => [
                'formatted' => $this->created_at?->format('d/m/Y'),
                'time' => $this->created_at?->format('H.i'),
                'timestamp' => $this->created_at?->toISOString(),
            ],
            // Keep original fields for backward compatibility if needed
            'metadata' => $this->metadata,
        ];
    }
}
