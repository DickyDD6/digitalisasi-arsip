<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// DEBUG: Check session state (remove after fixing)
Route::get('/debug/session', function (Request $request) {
    $currentSessionId = $request->session()->getId();
    $cookieName = config('session.cookie');
    $rawCookie = $_COOKIE[$cookieName] ?? 'NOT_FOUND';

    // Try to decrypt cookie manually
    $decryptedCookie = null;
    try {
        $decryptedCookie = \Crypt::decrypt($rawCookie, false);
    } catch (\Exception $e) {
        $decryptedCookie = 'DECRYPT_FAILED: ' . $e->getMessage();
    }

    $session = \DB::table('sessions')
        ->where('id', $currentSessionId)
        ->first();

    // Get all recent sessions
    $recentSessions = \DB::table('sessions')
        ->select('id', 'user_id', 'last_activity')
        ->orderBy('last_activity', 'desc')
        ->limit(5)
        ->get()
        ->map(fn($s) => [
            'id_prefix' => substr($s->id, 0, 20),
            'user_id' => $s->user_id,
            'last_activity' => date('H:i:s', $s->last_activity)
        ]);

    return response()->json([
        'cookie_name' => $cookieName,
        'raw_cookie_prefix' => substr($rawCookie, 0, 50) . '...',
        'decrypted_cookie' => $decryptedCookie,
        'session_getId' => $currentSessionId,
        'session_found_in_db' => $session ? true : false,
        'user_id_in_session' => $session->user_id ?? null,
        'auth_check_web' => \Auth::guard('web')->check(),
        'session_data' => $request->session()->all(),
        'recent_sessions_in_db' => $recentSessions,
    ]);
});

// DEBUG: Login with full trace (remove after fixing)
Route::post('/debug/login', function (Request $request) {
    $sessionIdBefore = $request->session()->getId();

    $credentials = $request->only('email', 'password');

    if (!\Auth::guard('web')->attempt($credentials)) {
        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    // DON'T regenerate session for now - just test
    // $request->session()->regenerate();

    // Manually save the session
    $request->session()->save();

    $sessionIdAfter = $request->session()->getId();
    $user = \Auth::guard('web')->user();

    // Check DB
    $sessionInDb = \DB::table('sessions')->where('id', $sessionIdAfter)->first();

    return response()->json([
        'success' => true,
        'session_id_before' => substr($sessionIdBefore, 0, 20),
        'session_id_after' => substr($sessionIdAfter, 0, 20),
        'session_regenerated' => $sessionIdBefore !== $sessionIdAfter,
        'user' => $user ? $user->email : null,
        'auth_check' => \Auth::guard('web')->check(),
        'session_in_db' => $sessionInDb ? true : false,
        'user_id_in_db' => $sessionInDb->user_id ?? null,
    ]);
});

// DIAGNOSTIC: Check what Postman is sending (REMOVE AFTER FIXING)
Route::post('/auth/login-debug', function (Request $request) {
    return response()->json([
        'headers' => [
            'content-type' => $request->header('Content-Type'),
            'accept' => $request->header('Accept'),
            'x-xsrf-token' => $request->header('X-XSRF-TOKEN') ? 'EXISTS (length: ' . strlen($request->header('X-XSRF-TOKEN')) . ')' : 'MISSING',
        ],
        'cookies' => [
            'XSRF-TOKEN exists' => $request->cookie('XSRF-TOKEN') ? 'YES' : 'NO',
            'session exists' => $request->cookie(config('session.cookie')) ? 'YES' : 'NO',
        ],
        'body_raw' => $request->getContent(),
        'body_parsed' => $request->all(),
        'email_exists' => $request->has('email'),
        'password_exists' => $request->has('password'),
        'session_id' => $request->session()->getId(),
    ]);
});

// Authentication routes
Route::post('/auth/login', [AuthController::class, 'login'])->name('login');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // User Management (UC-01) - Only accessible by manager
    Route::apiResource('users', UserController::class);

    // Document Verification (UC-08) - QC & Manager only
    // IMPORTANT: These must be BEFORE apiResource to prevent route collision
    Route::get('/documents/pending', [DocumentController::class, 'pending']);
    Route::patch('/documents/{document}/verify', [DocumentController::class, 'verify']);

    // Document Download (UC-10) - Manager & SBAP only
    Route::get('/documents/{document}/download', [DocumentController::class, 'download']);

    // Document Management (UC-04, UC-06, UC-07) - CRUD operations
    Route::apiResource('documents', DocumentController::class);
});

// Legacy route (can be removed later)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
