<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Requests\UpdateSystemSettingRequest;
use App\Http\Resources\SystemSettingResource;
use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class SystemSettingController extends Controller
{
    /**
     * Display a listing of system settings.
     */
    #[OA\Get(
        path: '/api/system-settings',
        summary: 'Daftar pengaturan sistem (UC-14)',
        description: 'Mengambil pengaturan sistem dalam bentuk key-value map dan detail array. Dapat difilter berdasarkan group.',
        security: [['cookieAuth' => []]],
        tags: ['System Settings'],
        parameters: [
            new OA\Parameter(name: 'group', in: 'query', description: 'Filter berdasarkan nama group (contoh: upload, app)', required: false, schema: new OA\Schema(type: 'string', example: 'upload')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Pengaturan sistem berhasil diambil', content: new OA\JsonContent(ref: '#/components/schemas/SystemSettingsResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $query = SystemSetting::query();

        if ($request->has('group')) {
            $query->where('group_name', $request->input('group'));
        }

        $settings = $query->get();

        // Key-value map response format for easy consumption by frontend
        $keyValueMap = [];
        foreach ($settings as $setting) {
            $keyValueMap[$setting->key] = $setting->value;
        }

        return response()->json([
            'status' => 'success',
            'data' => $keyValueMap,
            'details' => SystemSettingResource::collection($settings),
        ]);
    }

    /**
     * Bulk update system settings (Manager only).
     */
    #[OA\Put(
        path: '/api/system-settings',
        summary: 'Perbarui pengaturan sistem secara massal (UC-14) - Manager only',
        description: 'Memperbarui nilai dari array pengaturan sistem (key-value). Hanya dapat diakses oleh Manager.',
        security: [['cookieAuth' => []]],
        tags: ['System Settings'],
        requestBody: new OA\RequestBody(
            required: true,
            description: 'Array berisi pasangan key dan value pengaturan yang akan diubah',
            content: new OA\JsonContent(ref: '#/components/schemas/UpdateSystemSettingsRequest')
        ),
        responses: [
            new OA\Response(response: 200, description: 'Pengaturan sistem berhasil diperbarui', content: new OA\JsonContent(ref: '#/components/schemas/UpdateSystemSettingsResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 403, description: 'Forbidden (Bukan Manager)', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 422, description: 'Validation Error', content: new OA\JsonContent(ref: '#/components/schemas/ValidationError')),
        ]
    )]
    public function update(UpdateSystemSettingRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $updatedSettings = [];
        foreach ($validated['settings'] as $item) {
            $setting = SystemSetting::where('key', $item['key'])->first();
            if ($setting) {
                $setting->update([
                    'value' => $item['value'],
                    'updated_by' => $user->id,
                ]);
                $updatedSettings[] = $setting->fresh();
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Pengaturan sistem berhasil diperbarui.',
            'data' => SystemSettingResource::collection($updatedSettings),
        ]);
    }
}
