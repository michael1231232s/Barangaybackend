<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
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
        Vite::prefetch(concurrency: 3);

        // Behind Railway / HTTPS proxies: avoid mixed-content (http assets on https pages)
        if (! $this->app->isLocal()) {
            URL::forceScheme('https');

            // Vite tags & prefetch use asset(); second arg true forces https:// regardless of request scheme
            Vite::createAssetPathsUsing(function (string $path, ?bool $secure = null) {
                return asset($path, true);
            });
        }
    }
}
