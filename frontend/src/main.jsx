if (process.env.NODE_ENV === 'development' || (typeof window !== 'undefined' && window.location.hostname === 'localhost')) void import('code-to-figma');
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TranslationProvider } from 'react-auto-google-translate'

createRoot(document.getElementById('root')).render(
  <TranslationProvider originalLang="id" language="id">
    <App />
  </TranslationProvider>
)
