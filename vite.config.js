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
                name: 'TacticBoard - Papan Taktik Sepak Bola Modern',
                short_name: 'TacticBoard',
                description: 'Papan taktik sepak bola interaktif modern dengan simulasi visual, strategi pemain, dan coretan taktik offline.',
                theme_color: '#0ea5e9',
                background_color: '#0d1117',
                display: 'standalone',
                icons: [
                    {
                        src: '/logo.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                    {
                        src: '/logo.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
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
