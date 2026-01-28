<?php

return [

    /*
    |--------------------------------------------------------------------------
    | IP-Based Rate Limiting
    |--------------------------------------------------------------------------
    |
    | This value determines the maximum number of login attempts allowed
    | from a single IP address within the specified time window.
    |
    */

    'ip_limit' => [
        'attempts' => env('LOGIN_IP_LIMIT_ATTEMPTS', 75),
        'duration' => 1,  // minutes
    ],

    /*
    |--------------------------------------------------------------------------
    | Account Lockout Configuration
    |--------------------------------------------------------------------------
    |
    | Maximum failed attempts before account lockout and lockout duration
    | based on user role.
    |
    */

    'lockout' => [
        'max_attempts' => env('LOGIN_MAX_ATTEMPTS', 5),

        'duration' => [
            'manager' => env('LOGIN_LOCKOUT_MANAGER_MINUTES', 5),  // minutes
            'default' => env('LOGIN_LOCKOUT_DEFAULT_MINUTES', 1),  // minutes
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Cleanup Configuration
    |--------------------------------------------------------------------------
    |
    | Old login attempt records will be automatically deleted after this time.
    |
    */

    'cleanup_after' => env('LOGIN_CLEANUP_AFTER_MINUTES', 10),  // minutes

];
