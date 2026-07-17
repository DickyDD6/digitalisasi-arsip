<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Force HTTPS in production
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        // Prevent lazy loading in non-production to catch N+1 queries early
        Model::preventLazyLoading(! $this->app->isProduction());

        // Prevent silently discarding attributes that are not in $fillable
        Model::preventSilentlyDiscardingAttributes(! $this->app->isProduction());
    }
}
