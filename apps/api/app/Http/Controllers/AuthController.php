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

class AuthController extends Controller
{
    /**
     * Handle login request for Sanctum Token-Based API.
     * Issues a Personal Access Token on successful authentication.
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

    /**
     * Check if email is available.
     *
     * @param Request $request
     * @return JsonResponse
     */
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
}
