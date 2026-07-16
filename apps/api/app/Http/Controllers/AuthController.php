<?php

namespace App\Http\Controllers;

use App\Enums\AuditAction;
use App\Http\Requests\LoginRequest;
use App\Models\AuditLog;
use App\Services\LoginAttemptService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    /**
     * Get CSRF Cookie.
     */
    #[OA\Get(
        path: '/api/csrf-cookie',
        operationId: 'getCsrfCookie',
        summary: 'Get CSRF Cookie',
        description: 'Mengambil CSRF cookie yang diperlukan untuk autentikasi. Cookie `XSRF-TOKEN` akan otomatis tersimpan.',
        tags: ['Authentication'],
        responses: [
            new OA\Response(response: 204, description: 'No Content - CSRF cookie berhasil disimpan'),
        ]
    )]
    public function csrfCookie(): void
    {
        // This method is handled by Sanctum directly.
        // The annotation is placed here for documentation purposes only.
    }

    /**
     * Check if email is available.
     *
     * @param Request $request
     * @return JsonResponse
     */
    #[OA\Post(
        path: '/api/auth/check-email',
        operationId: 'checkEmail',
        summary: 'Check Email Availability (UC-12)',
        description: 'Cek apakah email sudah terdaftar (Public).',
        tags: ['Authentication'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'new.user@example.com'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Email tersedia',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'available', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Email tersedia.'),
                    ]
                )
            ),
            new OA\Response(
                response: 422,
                description: 'Email sudah terdaftar atau tidak valid',
                content: new OA\JsonContent(ref: '#/components/schemas/ValidationError')
            ),
        ]
    )]
    public function checkEmail(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $exists = \App\Models\User::where('email', $request->email)->exists();

        return response()->json([
            'available' => !$exists,
            'message' => $exists ? 'Email sudah digunakan.' : 'Email tersedia.',
        ]);
    }

    /**
     * Handle login request for Sanctum Stateful API.
     * Uses HTTP-only cookies for authentication.
     *
     * @param LoginRequest $request
     * @return JsonResponse
     * @throws ValidationException
     */
    #[OA\Post(
        path: '/api/auth/login',
        operationId: 'login',
        summary: 'Login',
        description: 'Login dengan email dan password',
        tags: ['Authentication'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/LoginRequest')
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Login berhasil',
                content: new OA\JsonContent(ref: '#/components/schemas/LoginResponse')
            ),
            new OA\Response(
                response: 422,
                description: 'Validation error - Kredensial salah atau field tidak valid',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Email atau password salah.'),
                        new OA\Property(
                            property: 'errors',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'email', type: 'array', items: new OA\Items(type: 'string'), example: ['Email atau password salah.']),
                            ]
                        ),
                        new OA\Property(property: 'remaining_attempts', type: 'integer', description: 'Sisa percobaan login sebelum akun dikunci', example: 4),
                    ]
                )
            ),
        ]
    )]
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            // Record failed attempt
            $loginAttemptService = app(LoginAttemptService::class);
            $loginAttemptService->recordFailedAttempt($request->email, $request);

            $remaining = $loginAttemptService->getRemainingAttempts($request->email);

            // Log failed login attempt for security monitoring
            AuditLog::log(
                action: AuditAction::LOGIN->value,
                description: "Login gagal untuk email: {$request->email}.",
                metadata: [
                    'email' => $request->email,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'remaining_attempts' => $remaining,
                ]
            );

            return response()->json([
                'message' => 'Email atau password salah.',
                'errors' => [
                    'email' => [
                        'Email atau password salah.'
                    ],
                ],
                'remaining_attempts' => $remaining,
            ], 422);
        }

        // Clear attempts on successful login
        app(LoginAttemptService::class)->clearAttempts($request->email);

        $user = Auth::user();

        // Revoke existing tokens with the same name (prevent token sprawl)
        $user->tokens()->where('name', 'auth_token')->delete();

        // Issue new Personal Access Token with expiration
        $token = $user->createToken('auth_token');

        // Log successful login
        AuditLog::log(
            action: AuditAction::LOGIN->value,
            description: "User {$user->name} berhasil login.",
            metadata: [
                'user_id' => $user->id,
                'email' => $user->email,
                'role' => $user->role->value,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]
        );

        return response()->json([
            'message' => 'Login berhasil.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role->value,
                ],
                'token' => $token->plainTextToken,
                'token_type' => 'Bearer',
                'expires_in' => config('sanctum.expiration', 1440) * 60, // seconds
            ],
        ], 200);
    }

    /**
     * Handle logout request.
     * Revokes the current access token.
     *
     * @param Request $request
     * @return JsonResponse
     */
    #[OA\Post(
        path: '/api/auth/logout',
        operationId: 'logout',
        summary: 'Logout',
        description: 'Logout dan invalidate session',
        security: [['cookieAuth' => []]],
        tags: ['Authentication'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Logout berhasil',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Logout berhasil.'),
                    ]
                )
            ),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.')])),
        ]
    )]
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        // Log logout before revoking token
        AuditLog::log(
            action: AuditAction::LOGOUT->value,
            description: "User {$user->name} logout.",
            metadata: [
                'user_id' => $user->id,
                'email' => $user->email,
                'ip_address' => $request->ip(),
            ],
            userId: $user->id
        );

        // Revoke the token used for this request
        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil.',
        ], 200);
    }

    /**
     * Logout from all devices.
     * Revokes ALL access tokens for the authenticated user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logoutAll(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logout dari semua perangkat berhasil.',
        ], 200);
    }

    /**
     * Get authenticated user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    #[OA\Get(
        path: '/api/auth/me',
        operationId: 'getCurrentUser',
        summary: 'Get Current User',
        description: 'Mengambil data user yang sedang login',
        security: [['cookieAuth' => []]],
        tags: ['Authentication'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Data user berhasil diambil',
                content: new OA\JsonContent(ref: '#/components/schemas/UserResponse')
            ),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(properties: [new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.')])),
        ]
    )]
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Tidak terautentikasi.',
            ], 401);
        }

        return response()->json([
            'message' => 'Data pengguna berhasil diambil.',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
            ],
        ], 200);
    }
}
