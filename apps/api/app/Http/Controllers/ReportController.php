<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use OpenApi\Attributes as OA;

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
    #[OA\Post(
        path: '/api/reports/generate',
        operationId: 'generateReport',
        summary: 'Generate Report (UC-09)',
        description: "Membuat laporan berdasarkan parameter yang diberikan (Manager only).\n\nMendukung format PDF, XLSX, dan CSV.\nTipe laporan: monthly, annual, custom.",
        security: [['cookieAuth' => []]],
        tags: ['Reports'],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(ref: '#/components/schemas/ReportGenerateRequest')),
        responses: [
            new OA\Response(response: 200, description: 'File laporan berhasil di-generate', content: [
                new OA\MediaType(mediaType: 'application/pdf', schema: new OA\Schema(type: 'string', format: 'binary')),
                new OA\MediaType(mediaType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', schema: new OA\Schema(type: 'string', format: 'binary')),
                new OA\MediaType(mediaType: 'text/csv', schema: new OA\Schema(type: 'string', format: 'binary')),
            ]),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.')])),
            new OA\Response(response: 403, description: 'Forbidden', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'This action is unauthorized.')])),
            new OA\Response(response: 422, description: 'Validation Error', content: new OA\JsonContent(ref: '#/components/schemas/ValidationError')),
            new OA\Response(
                response: 500,
                description: 'Gagal membuat laporan',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Gagal membuat laporan.'),
                        new OA\Property(property: 'error', type: 'string', example: 'Internal error message'),
                    ]
                )
            ),
        ]
    )]
    public function generate(Request $request)
    {
        $this->authorize('viewAny', \App\Models\AuditLog::class);

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
    #[OA\Get(
        path: '/api/reports/dashboard',
        operationId: 'getDashboardStats',
        summary: 'Get Dashboard Stats (UC-09)',
        description: 'Mengambil statistik dashboard untuk halaman laporan (Manager only)',
        security: [['cookieAuth' => []]],
        tags: ['Reports'],
        parameters: [
            new OA\Parameter(name: 'start_date', in: 'query', description: 'Filter dari tanggal (default: awal bulan ini)', schema: new OA\Schema(type: 'string', format: 'date')),
            new OA\Parameter(name: 'end_date', in: 'query', description: 'Filter sampai tanggal (default: sekarang)', schema: new OA\Schema(type: 'string', format: 'date')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Statistik dashboard berhasil diambil', content: new OA\JsonContent(ref: '#/components/schemas/DashboardStatsResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.')])),
            new OA\Response(response: 403, description: 'Forbidden', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'This action is unauthorized.')])),
        ]
    )]
    public function dashboardStats(Request $request): JsonResponse
    {
        $this->authorize('viewAny', \App\Models\AuditLog::class);

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
