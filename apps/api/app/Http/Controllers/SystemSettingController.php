<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SystemSettingController extends Controller
{
    /**
     * Display a listing of system settings.
     */
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
            'details' => $settings,
        ]);
    }

    /**
     * Bulk update system settings (Manager only).
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->hasRole(UserRole::MANAGER)) {
            return response()->json([
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|exists:system_settings,key',
            'settings.*.value' => 'required|string',
        ]);

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
            'data' => $updatedSettings,
        ]);
    }
}
