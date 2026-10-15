import './bootstrap';
import '../css/index.css';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { TranslationProvider } from 'react-auto-google-translate';

const appName = import.meta.env.VITE_APP_NAME || 'Tacticboard';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <TranslationProvider originalLang="id" language="id">
                <App {...props} />
            </TranslationProvider>
        );
    },
    progress: {
        color: '#0ea5e9',
    },
});
