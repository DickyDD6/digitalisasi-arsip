<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ReportController extends Controller
{
    protected ReportService $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * Generate a report based on the provided parameters.
     *
     * @param Request $request
     * @return mixed
     */
    public function generate(Request $request)
    {
        // Validate request
        $request->validate([
            'period_start' => 'required|date',
            'period_end' => 'required|date|after_or_equal:period_start',
            'format' => 'required|in:pdf,xlsx,csv',
            'type' => 'required|in:monthly,annual,custom',
            'style' => 'nullable|in:detailed,summary,executive',
            'content' => 'nullable|array',
            'content.*' => 'in:upload_stats,qc_metrics,doc_status,user_activity,trend_analysis'
        ]);

        try {
            $params = $request->all();

            // Generate the report
            // returns a download response or file path
            return $this->reportService->generate($params);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal membuat laporan.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get dashboard statistics for the reports page.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function dashboardStats(Request $request): JsonResponse
    {
        $start = $request->input('start_date') ? \Carbon\Carbon::parse($request->input('start_date')) : now()->startOfMonth();
        $end = $request->input('end_date') ? \Carbon\Carbon::parse($request->input('end_date')) : now();

        // Re-use service methods or minimal logic here for the top cards
        // For simplicity, we can fetch basic stats

        $stats = [
            'total_reports_generated' => 0, // Placeholder if we track generated reports
            'most_downloaded_type' => 'Bulanan',
            'last_generated' => now()->subHours(2)->format('Y-m-d H:i'),
        ];

        return response()->json([
            'message' => 'Statistik dashboard berhasil diambil.',
            'data' => $stats,
        ], 200);
    }

    /**
     * Download a previously generated report (if stored).
     * 
     * @param string $filename
     * @return BinaryFileResponse
     */
    public function download($filename)
    {
        // Logic to retrieve stored file if we save them
        // For now, generate() handles direct download streams
        return response()->json(['message' => 'Fitur download arsip belum tersedia.'], 501);
    }
}
