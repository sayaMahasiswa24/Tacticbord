<?php

namespace App\Providers;

use Illuminate\Database\SQLiteConnection;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Jika berjalan di lingkungan Serverless Vercel (atau filesystem read-only)
        if (env('VERCEL') || (env('APP_ENV') === 'production' && is_dir('/tmp'))) {
            $bundledDb = database_path('database.sqlite');
            $tmpDb = '/tmp/database.sqlite';
            if (file_exists($bundledDb) && !file_exists($tmpDb)) {
                @copy($bundledDb, $tmpDb);
                @chmod($tmpDb, 0666);
            }
            Config::set('database.connections.sqlite.database', $tmpDb);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Gunakan journal_mode = MEMORY di Vercel agar tidak membuat file -wal/-shm ekstra di /tmp
        if (config('database.default') === 'sqlite') {
            $isVercel = env('VERCEL') || (env('APP_ENV') === 'production' && is_dir('/tmp'));
            $mode = $isVercel ? 'MEMORY' : 'WAL';
            try {
                if (DB::connection() instanceof SQLiteConnection) {
                    DB::statement("PRAGMA journal_mode = {$mode};");
                }
            } catch (\Throwable $e) {
                // Ignore during testing / mock environments
            }
        }
    }
}
