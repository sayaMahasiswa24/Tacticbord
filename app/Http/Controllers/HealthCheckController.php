<?php

namespace App\Http\Controllers;

use App\Models\Formation;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthCheckController extends Controller
{
    /**
     * Return comprehensive application health diagnostics.
     */
    public function __invoke(): JsonResponse
    {
        $bundledDbPath = database_path('database.sqlite');
        $bundledExists = file_exists($bundledDbPath);
        $manifestPath = public_path('build/manifest.json');
        $manifestExists = file_exists($manifestPath);

        $tmpWritable = is_writable(sys_get_temp_dir());
        $isVercel = (bool) (env('VERCEL') || request()->server('VERCEL'));
        $targetDbPath = config('database.connections.sqlite.database');

        $formationsCount = 0;
        $dbConnected = false;

        try {
            $formationsCount = Formation::count();
            $dbConnected = true;
        } catch (\Throwable $e) {
            $dbConnected = false;
        }

        $allHealthy = $bundledExists && $manifestExists && $dbConnected && $formationsCount > 0;

        return response()->json([
            'status' => $allHealthy ? 'healthy' : 'degraded',
            'timestamp' => now()->toIso8601String(),
            'environment' => [
                'php_version' => PHP_VERSION,
                'framework' => 'Laravel ' . app()->version(),
                'is_vercel' => $isVercel,
                'pdo_sqlite_loaded' => extension_loaded('pdo_sqlite'),
            ],
            'checks' => [
                'bundled_sqlite' => [
                    'exists' => $bundledExists,
                    'path' => $bundledDbPath,
                    'size_bytes' => $bundledExists ? filesize($bundledDbPath) : 0,
                ],
                'sqlite_storage' => [
                    'tmp_writable' => $tmpWritable,
                    'target_path' => $targetDbPath,
                    'target_exists' => file_exists($targetDbPath),
                    'target_ready' => $dbConnected,
                    'formations_count' => $formationsCount,
                ],
                'vite_manifest' => [
                    'exists' => $manifestExists,
                    'path' => $manifestPath,
                ],
                'app_key' => [
                    'configured' => !empty(config('app.key')),
                    'prefix' => !empty(config('app.key')) ? substr(config('app.key'), 0, 10) . '...' : 'missing',
                ],
                'features' => [
                    'ai_assistant_enabled' => (bool) config('features.ai_assistant_enabled'),
                ],
            ],
        ], $allHealthy ? 200 : 503);
    }
}
