<?php

namespace App\Http\Middleware;

use App\Models\AuditLog;
use App\Services\LoginAttemptService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ThrottleLoginAttempts
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $email = $request->input('email');

        if (!$email) {
            return $next($request);
        }

        $loginAttemptService = app(LoginAttemptService::class);

        if ($loginAttemptService->isLocked($email)) {
            $expiry = $loginAttemptService->getLockoutExpiry($email);
            $seconds = $loginAttemptService->getSecondsUntilUnlock($email);
            $minutes = ceil($seconds / 60);

            // Log account lockout for security monitoring
            AuditLog::log(
                action: 'account_locked',
                description: "Akun {$email} dikunci sementara karena terlalu banyak percobaan login.",
                metadata: [
                    'email' => $email,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'locked_until' => $expiry->toIso8601String(),
                    'retry_after_seconds' => $seconds,
                ]
            );

            return response()->json([
                'message' => 'Terlalu banyak percobaan login. Akun dikunci sementara.',
                'errors' => [
                    'email' => [
                        sprintf(
                            'Akun Anda dikunci hingga %s. Silakan coba lagi setelah %d menit.',
                            $expiry->format('Y-m-d H:i:s'),
                            $minutes
                        )
                    ],
                ],
                'locked_until' => $expiry->toIso8601String(),
            ], 429);
        }

        return $next($request);
    }
}
