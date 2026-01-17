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
        $middleware->statefulApi();

        // Add session middleware to API routes BEFORE Sanctum 
        // This ensures session is available for all API requests
        $middleware->api(prepend: [
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Handle unauthenticated requests for API - return JSON instead of redirect
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            // Check if this is an API request (with or without leading slash)
            $isApiRequest = $request->is('api/*') ||
                $request->is('*/api/*') ||
                str_starts_with($request->path(), 'api/') ||
                $request->expectsJson();

            if ($isApiRequest) {
                return response()->json([
                    'message' => 'Unauthenticated. Please login first.',
                ], 401);
            }
        });
    })->create();
