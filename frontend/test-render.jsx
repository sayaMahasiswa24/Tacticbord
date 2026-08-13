import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { TranslationProvider, LanguageSelector } from 'react-auto-google-translate';

try {
    const html = ReactDOMServer.renderToString(
        <TranslationProvider originalLang="id">
            <LanguageSelector />
        </TranslationProvider>
    );
    console.log("SUCCESS");
} catch (err) {
    console.error("ERROR CAUGHT:");
    console.error(err);
}
