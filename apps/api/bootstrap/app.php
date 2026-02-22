<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Token-based API — no session/cookie middleware needed
        // Register custom middleware aliases
        $middleware->alias([
            'throttle.login.attempts' => \App\Http\Middleware\ThrottleLoginAttempts::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Force JSON response for API requests even without correct headers
        $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
            if ($request->is('api/*')) {
                return true;
            }
            return $request->expectsJson();
        });

        // Handle unauthenticated requests for API - return JSON with custom message
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            // Logic moved to shouldRenderJsonWhen, but custom message needs render
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Unauthenticated. Please login first.',
                ], 401);
            }
        });
    })->create();
