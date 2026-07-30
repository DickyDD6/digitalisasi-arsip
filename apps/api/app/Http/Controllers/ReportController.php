<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Document;
use App\Enums\DocumentStatus;
use App\Services\ReportService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
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
                        new OA\Property(property: 'message', type: 'string', example: 'Gagal membuat laporan. Silakan coba lagi.'),
                    ]
                )
            ),
        ]
    )]
    public function generate(Request $request)
    {
        $this->authorize('viewAny', AuditLog::class);

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
            return $this->reportService->generate($params);

        } catch (\Exception $e) {
            // Log the full error for debugging, but don't expose internals to client
            Log::error('Report generation failed', [
                'params' => $request->only(['period_start', 'period_end', 'format', 'type']),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Gagal membuat laporan. Silakan coba lagi.',
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
        $this->authorize('viewAny', AuditLog::class);

        $start = $request->input('start_date') ? Carbon::parse($request->input('start_date')) : now()->startOfMonth();
        $end = $request->input('end_date') ? Carbon::parse($request->input('end_date')) : now();

        // Real statistics from database
        $stats = [
            'total_documents' => Document::whereBetween('created_at', [$start, $end])->count(),
            'verified_documents' => Document::whereBetween('created_at', [$start, $end])
                ->where('status', DocumentStatus::VERIFIED)->count(),
            'pending_documents' => Document::whereBetween('created_at', [$start, $end])
                ->where('status', DocumentStatus::PENDING)->count(),
            'rejected_documents' => Document::whereBetween('created_at', [$start, $end])
                ->where('status', DocumentStatus::REJECTED)->count(),
        ];

        return response()->json([
            'message' => 'Statistik dashboard berhasil diambil.',
            'data' => $stats,
            'period' => [
                'start_date' => $start->toDateString(),
                'end_date' => $end->toDateString(),
            ],
        ], 200);
    }

    /**
     * Get QC verifier performance report with pagination.
     */
    public function qcPerformance(Request $request): JsonResponse
    {
        $this->authorize('viewAny', AuditLog::class);

        $start = $request->input('start_date') ? Carbon::parse($request->input('start_date')) : now()->startOfYear();
        $end = $request->input('end_date') ? Carbon::parse($request->input('end_date')) : now();
        $perPage = (int) $request->input('per_page', 10);
        $page = (int) $request->input('page', 1);

        $report = $this->reportService->getQcPerformanceReport($start, $end, $perPage, $page);

        return response()->json($report);
    }
}
