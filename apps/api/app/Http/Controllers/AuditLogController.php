<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuditLogResource;
use App\Enums\AuditAction;
use App\Enums\ModelType;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

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
            'today_total' => AuditLog::whereDate('created_at', today())->count(),
            'today_upload' => AuditLog::whereDate('created_at', today())
                ->where('action', AuditAction::UPLOAD_DOCUMENT->value)
                ->count(),
            'today_verify' => AuditLog::whereDate('created_at', today())
                ->where('action', AuditAction::VERIFY_DOCUMENT->value)
                ->count(),
            'today_reject' => AuditLog::whereDate('created_at', today())
                ->where('action', AuditAction::REJECT_DOCUMENT->value)
                ->count(),
            'by_action' => AuditLog::whereBetween('created_at', [$startDate, $endDate])
                ->select('action', \DB::raw('count(*) as count'))
                ->groupBy('action')
                ->get()
                ->mapWithKeys(function ($item) {
                    $enum = AuditAction::tryFrom($item->action);
                    return [$enum?->label() ?? $item->action => $item->count];
                }),
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

    /**
     * Export audit logs to CSV.
     *
     * @param Request $request
     * @return StreamedResponse
     */
    public function export(Request $request): StreamedResponse
    {
        $this->authorize('viewAny', AuditLog::class);

        $startDate = $request->input('start_date', now()->subDays(30));
        $endDate = $request->input('end_date', now());

        $query = AuditLog::with('user')
            ->whereBetween('created_at', [$startDate, $endDate]);

        // Apply filters if present
        if ($request->has('action')) {
            $query->where('action', $request->input('action'));
        }
        if ($request->has('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        $logs = $query->orderBy('created_at', 'desc')->get();

        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=audit_logs_" . date('Y-m-d_H-i') . ".csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function () use ($logs) {
            $file = fopen('php://output', 'w');

            // Add BOM for Excel compatibility
            fputs($file, "\xEF\xBB\xBF");

            fputcsv($file, ['No', 'User', 'Role', 'Aksi', 'ID Dokumen', 'Nama Dokumen', 'Waktu', 'Tanggal', 'Deskripsi']);

            foreach ($logs as $index => $log) {
                $actionEnum = AuditAction::tryFrom($log->action);

                fputcsv($file, [
                    $index + 1,
                    $log->user?->name ?? 'System',
                    $log->user?->role?->value ?? 'System', // Use value for Enum
                    $actionEnum?->label() ?? $log->action,
                    $log->model_type === ModelType::DOCUMENT->value ? 'DOC-' . $log->model_id : '-',
                    $log->metadata['file_name'] ?? '-',
                    $log->created_at->format('H.i'),
                    $log->created_at->format('d/m/Y'),
                    $log->description
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
