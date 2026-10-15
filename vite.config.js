import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITEST;

export default defineConfig({
    plugins: [
        !isTest && laravel({
            input: [
                'resources/css/index.css',
                'resources/css/app.css',
                'resources/js/app.jsx',
            ],
            refresh: true,
        }),
        react(),
        !isTest && VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'icons.svg', 'logo.png'],
            manifest: {
                name: 'Tacticboard',
                short_name: 'Tacticboard',
                description: 'Tacticboard Football',
                theme_color: '#000000',
                background_color: '#000000',
                display: 'standalone',
                icons: [
                    {
                        src: '/logo.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/logo.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ].filter(Boolean),
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./resources/js/setupTests.js'],
        globals: true,
        include: ['resources/js/**/*.{test,spec}.{js,jsx}'],
        pool: 'forks',
    },
});
