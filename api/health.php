<?php

header('Content-Type: application/json; charset=utf-8');

$report = [
    'status' => 'healthy',
    'timestamp' => date(DATE_ATOM),
    'environment' => [
        'php_version' => PHP_VERSION,
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'cli',
        'is_vercel' => (bool) (getenv('VERCEL') || isset($_ENV['VERCEL'])),
        'pdo_sqlite_loaded' => extension_loaded('pdo_sqlite'),
    ],
    'checks' => [],
];

$allHealthy = true;

// 1. Check Bundled SQLite Database
$bundledDbPath = dirname(__DIR__) . '/database/database.sqlite';
$bundledExists = file_exists($bundledDbPath);
$report['checks']['bundled_sqlite'] = [
    'exists' => $bundledExists,
    'path' => $bundledDbPath,
    'size_bytes' => $bundledExists ? filesize($bundledDbPath) : 0,
];
if (!$bundledExists) {
    $allHealthy = false;
}

// 2. Check /tmp Writable and Auto-Copy
$isVercel = (bool) (getenv('VERCEL') || isset($_ENV['VERCEL']));
$tmpDir = sys_get_temp_dir();
$tmpWritable = is_writable($tmpDir);
$targetDbPath = $isVercel ? '/tmp/database.sqlite' : $bundledDbPath;

$tmpSqliteReady = false;
$formationCount = 0;

if ($isVercel && $bundledExists) {
    if (!file_exists($targetDbPath)) {
        @copy($bundledDbPath, $targetDbPath);
        @chmod($targetDbPath, 0666);
    }
}

if (file_exists($targetDbPath) && extension_loaded('pdo_sqlite')) {
    try {
        $pdo = new PDO("sqlite:{$targetDbPath}", null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_TIMEOUT => 3,
        ]);
        $stmt = $pdo->query("SELECT count(*) FROM formations");
        $formationCount = (int) $stmt->fetchColumn();
        $tmpSqliteReady = $formationCount > 0;
    } catch (\Throwable $e) {
        $report['checks']['database_query_error'] = $e->getMessage();
        $tmpSqliteReady = false;
    }
}

$report['checks']['sqlite_storage'] = [
    'tmp_writable' => $tmpWritable,
    'target_path' => $targetDbPath,
    'target_exists' => file_exists($targetDbPath),
    'target_ready' => $tmpSqliteReady,
    'formations_count' => $formationCount,
];
if (!$tmpSqliteReady) {
    $allHealthy = false;
}

// 3. Check Vite Manifest
$manifestPath = dirname(__DIR__) . '/public/build/manifest.json';
$manifestExists = file_exists($manifestPath);
$report['checks']['vite_manifest'] = [
    'exists' => $manifestExists,
    'path' => $manifestPath,
];
if (!$manifestExists) {
    $allHealthy = false;
}

// 4. Check APP_KEY
$appKey = getenv('APP_KEY') ?: ($_ENV['APP_KEY'] ?? '');
if (empty($appKey) && file_exists(dirname(__DIR__) . '/.env')) {
    $envContent = @file_get_contents(dirname(__DIR__) . '/.env');
    if ($envContent && preg_match('/^APP_KEY=(.+)$/m', $envContent, $m)) {
        $appKey = trim($m[1], " \t\n\r\0\x0B\"'");
    }
}
$appKeyConfigured = !empty($appKey);
$report['checks']['app_key'] = [
    'configured' => $appKeyConfigured,
    'prefix' => $appKeyConfigured ? substr($appKey, 0, 10) . '...' : 'missing',
];
if (!$appKeyConfigured) {
    $allHealthy = false;
}

// 5. Feature Flags
$report['checks']['features'] = [
    'ai_assistant_enabled' => (getenv('AI_ASSISTANT_ENABLED') === 'true' || ($_ENV['AI_ASSISTANT_ENABLED'] ?? '') === 'true'),
];

$report['status'] = $allHealthy ? 'healthy' : 'degraded';
if (!$allHealthy) {
    http_response_code(503);
}

echo json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
