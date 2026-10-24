/**
 * TacticBoard Service Worker for Offline PWA Support
 */

const CACHE_NAME = 'tacticboard-offline-v1';

const PRECACHE_ASSETS = [
  '/',
  '/board',
  '/manifest.json',
  '/logo.png',
  '/favicon.svg',
  '/icons.svg',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css'
];

// Install: Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[PWA SW] Pre-caching core app shell...');
      for (const asset of PRECACHE_ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn('[PWA SW] Failed to precache:', asset, err);
        }
      }
    })
  );
  self.skipWaiting();
});

// Activate: Remove stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[PWA SW] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Strategy depending on request type
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Ignore browser extensions, analytics, or chrome internal schemes
  if (!url.protocol.startsWith('http')) return;

  // 1. Navigation requests (HTML pages like /board or /)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(async () => {
          console.log('[PWA SW] Offline mode: Serving cached page for', req.url);
          const cachedRes = await caches.match(req);
          if (cachedRes) return cachedRes;

          // Fallback to /board
          const boardCache = await caches.match('/board');
          if (boardCache) return boardCache;

          // Fallback to root /
          const rootCache = await caches.match('/');
          if (rootCache) return rootCache;

          return new Response(
            `<!DOCTYPE html>
            <html lang="id">
            <head><meta charset="utf-8"><title>TacticBoard Offline</title><meta name="viewport" content="width=device-width, initial-scale=1"></head>
            <body style="font-family:sans-serif;background:#0d1117;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;padding:20px;">
              <div>
                <img src="/logo.png" style="width:80px;height:80px;margin-bottom:16px;" alt="Logo" />
                <h1 style="color:#0ea5e9;margin:0 0 10px 0;">TacticBoard Mode Offline</h1>
                <p style="color:#94a3b8;max-width:400px;margin:0 auto 20px auto;">Silakan buka halaman papan taktik yang sudah tersimpan di cache.</p>
                <a href="/board" style="display:inline-block;background:#0ea5e9;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Buka Papan Taktik</a>
              </div>
            </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // 2. Static Assets (CSS, JS, Fonts, Images)
  // Stale-While-Revalidate with Cache-First fallback
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
