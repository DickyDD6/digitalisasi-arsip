<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LoginAttemptService
{
    /**
     * Get maximum number of failed attempts before lockout from config.
     */
    protected function getMaxAttempts(): int
    {
        return config('login-security.lockout.max_attempts', 5);
    }

    /**
     * Check if account is currently locked.
     *
     * @param string $email
     * @return bool
     */
    public function isLocked(string $email): bool
    {
        $lockoutDuration = $this->getLockoutDuration($email);
        $threshold = now()->subMinutes($lockoutDuration);

        $failedAttempts = DB::table('login_attempts')
            ->where('email', $email)
            ->where('failed_at', '>=', $threshold)
            ->count();

        return $failedAttempts >= $this->getMaxAttempts();
    }

    /**
     * Get lockout duration in minutes based on user role.
     *
     * @param string $email
     * @return int Minutes
     */
    public function getLockoutDuration(string $email): int
    {
        $user = User::where('email', $email)->first();

        // If user doesn't exist, treat as non-manager (1 minute lockout)
        if (!$user) {
            return config('login-security.lockout.duration.default', 1);
        }

        // Manager gets longer lockout duration
        if ($user->role->value === 'manager') {
            return config('login-security.lockout.duration.manager', 5);
        }

        return config('login-security.lockout.duration.default', 1);
    }

    /**
     * Record a failed login attempt.
     *
     * @param string $email
     * @param Request $request
     * @return void
     */
    public function recordFailedAttempt(string $email, Request $request): void
    {
        DB::table('login_attempts')->insert([
            'email' => $email,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'failed_at' => now(),
        ]);

        // Cleanup old records (older than 10 minutes)
        $this->cleanupOldAttempts();
    }

    /**
     * Clear all failed attempts for an email (on successful login).
     *
     * @param string $email
     * @return void
     */
    public function clearAttempts(string $email): void
    {
        DB::table('login_attempts')
            ->where('email', $email)
            ->delete();
    }

    /**
     * Get remaining attempts before lockout.
     *
     * @param string $email
     * @return int
     */
    public function getRemainingAttempts(string $email): int
    {
        $lockoutDuration = $this->getLockoutDuration($email);
        $threshold = now()->subMinutes($lockoutDuration);

        $failedAttempts = DB::table('login_attempts')
            ->where('email', $email)
            ->where('failed_at', '>=', $threshold)
            ->count();

        $remaining = $this->getMaxAttempts() - $failedAttempts;

        return max(0, $remaining);
    }

    /**
     * Get lockout expiry time if account is locked.
     * Lockout starts from the LAST failed attempt, not the first.
     *
     * @param string $email
     * @return Carbon|null
     */
    public function getLockoutExpiry(string $email): ?Carbon
    {
        if (!$this->isLocked($email)) {
            return null;
        }

        $lockoutDuration = $this->getLockoutDuration($email);
        $threshold = now()->subMinutes($lockoutDuration);

        // Get LAST failed attempt within lockout window
        $lastAttempt = DB::table('login_attempts')
            ->where('email', $email)
            ->where('failed_at', '>=', $threshold)
            ->orderBy('failed_at', 'desc')  // Changed from 'asc' to 'desc'
            ->first();

        if (!$lastAttempt) {
            return null;
        }

        return Carbon::parse($lastAttempt->failed_at)
            ->addMinutes($lockoutDuration);
    }

    /**
     * Get seconds until lockout expires.
     *
     * @param string $email
     * @return int|null
     */
    public function getSecondsUntilUnlock(string $email): ?int
    {
        $expiry = $this->getLockoutExpiry($email);

        if (!$expiry) {
            return null;
        }

        return max(0, $expiry->diffInSeconds(now()));
    }

    /**
     * Cleanup old login attempts (configurable threshold).
     *
     * @return void
     */
    protected function cleanupOldAttempts(): void
    {
        $cleanupAfter = config('login-security.cleanup_after', 10);

        DB::table('login_attempts')
            ->where('failed_at', '<', now()->subMinutes($cleanupAfter))
            ->delete();
    }
}
