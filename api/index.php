<?php

// Memastikan direktori sementara di /tmp tersedia setiap kali fungsi serverless menyala
$tmpDirs = ['/tmp/views', '/tmp/cache', '/tmp/sessions'];
foreach ($tmpDirs as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0777, true);
    }
}

require __DIR__ . '/../public/index.php';
