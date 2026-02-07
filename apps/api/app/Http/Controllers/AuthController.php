<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\AuditLog;
use App\Services\LoginAttemptService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle login request for Sanctum Stateful API.
     * Uses HTTP-only cookies for authentication.
     *
     * @param LoginRequest $request
     * @return JsonResponse
     * @throws ValidationException
     */
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
                action: 'failed_login_attempt',
                description: "Login gagal untuk email: {$request->email}",
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
                'remaining_attempts' => $remaining, // How many attempts left before lockout
            ], 422);
        }

        // Clear attempts on successful login
        app(LoginAttemptService::class)->clearAttempts($request->email);

        // Regenerate session to prevent session fixation attacks
        $request->session()->regenerate();

        $user = Auth::user();

        // Log successful login
        AuditLog::log(
            action: 'successful_login',
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
            ],
        ], 200);
    }

    /**
     * Handle logout request.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout berhasil.',
        ], 200);
    }

    /**
     * Get authenticated user.
     *
     * @param Request $request
     * @return JsonResponse
     */
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
