<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuditLogResource;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    /**
     * Display a listing of audit logs.
     * Only accessible by Manager role.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', AuditLog::class);

        $query = AuditLog::with('user');

        // Filter by action
        if ($request->has('action')) {
            $query->where('action', $request->input('action'));
        }

        // Filter by user
        if ($request->has('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        // Filter by model type
        if ($request->has('model_type')) {
            $query->where('model_type', $request->input('model_type'));
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [
                $request->input('start_date'),
                $request->input('end_date')
            ]);
        }

        // Search by description
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('description', 'like', "%{$search}%");
        }

        // Pagination
        $perPage = $request->input('per_page', 20);
        $logs = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'message' => 'Log aktivitas berhasil diambil.',
            'data' => AuditLogResource::collection($logs),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
            ],
        ], 200);
    }

    /**
     * Get statistics about audit logs.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function statistics(Request $request): JsonResponse
    {
        $this->authorize('viewAny', AuditLog::class);

        // Get date range (default: last 30 days)
        $startDate = $request->input('start_date', now()->subDays(30));
        $endDate = $request->input('end_date', now());

        $stats = [
            'total_activities' => AuditLog::whereBetween('created_at', [$startDate, $endDate])->count(),
            'by_action' => AuditLog::whereBetween('created_at', [$startDate, $endDate])
                ->select('action', \DB::raw('count(*) as count'))
                ->groupBy('action')
                ->get()
                ->pluck('count', 'action'),
            'by_user' => AuditLog::with('user:id,name')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->select('user_id', \DB::raw('count(*) as count'))
                ->groupBy('user_id')
                ->get()
                ->map(fn($item) => [
                    'user' => $item->user?->name ?? 'System',
                    'count' => $item->count
                ]),
            'recent_activities' => AuditLogResource::collection(
                AuditLog::with('user')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->orderBy('created_at', 'desc')
                    ->limit(10)
                    ->get()
            ),
        ];

        return response()->json([
            'message' => 'Statistik aktivitas berhasil diambil.',
            'data' => $stats,
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ], 200);
    }
}
