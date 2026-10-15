# ⚽ Football Tactical Board — Modern Monolith

A high-performance, interactive **Football Tactical Board** web application built with **Laravel 12**, **React 18 (Inertia.js v2)**, and **SQLite (WAL Mode)**.

---

## 🌟 Overview & Key Features

- **Integrated Modern Monolith:** Eliminates the complexity of separate frontend and backend micro-deployments by coupling Laravel 12 and React 18 via Inertia.js v2 page props and direct SQLite persistence.
- **High-Performance 2D Pitch Canvas:**
  - FIFA-regulation markings, penalty boxes, center circles, and corner arcs.
  - Interactive player dragging and positioning with touch & mouse gesture support.
  - Directional passing networks and 54 tactical zone heatmaps.
  - Freehand drawing annotations, straight arrows, dashed movements, and curves.
  - Multi-scenario tactical phases and layers.
- **Rich Tactical Data & Formations:**
  - Built-in tactical formations (4-3-3, 4-2-3-1, 4-4-2, 3-5-2, 3-4-3, 5-3-2, 4-1-4-1).
  - 45+ tactical player roles across 5 positional categories (Goalkeepers, Defenders, Midfielders, Wingers, Forwards).
  - Tactical style presets (*Tiki-Taka*, *Gegenpressing*, *Catenaccio*, *Park the Bus*, *Direct Counter*).
- **Persistent Storage in SQLite (WAL Mode):**
  - Instant server-side saving, loading, and deletion of custom tactics with optimistic local caching.
  - Configured with `PRAGMA journal_mode = WAL;` for high-concurrency read/write transactions.
- **Centralized Feature Flags:**
  - AI Assistant module safely isolated and gated behind `AI_ASSISTANT_ENABLED=false` via `config/features.php` and Inertia shared props.
- **PWA & Audio Feedback:**
  - Full Progressive Web App (PWA) offline support with service worker caching.
  - Web Audio API pitch sound effects (whistle, ball kick, click, reset).
  - Auto multilingual translation support via `react-auto-google-translate`.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Backend Framework** | [Laravel 12](https://laravel.com) (PHP 8.2+) |
| **Frontend Framework** | [React 18.3.1](https://react.dev) + [Inertia.js v2](https://inertiajs.com) |
| **Asset Bundler** | [Vite 6](https://vitejs.dev) + [Laravel Vite Plugin](https://laravel.com/docs/12.x/vite) |
| **Database** | SQLite 3 (WAL Journal Mode) |
| **Rendering Engine** | HTML5 Canvas 2D + Web Audio API |
| **PWA & Offline** | `vite-plugin-pwa` + Workbox |
| **Containerization** | Multi-Stage Docker (PHP 8.2-FPM + Nginx + Alpine + Supervisord) |

---

## 🚀 Quickstart (Local Development)

### 1. Prerequisites
- **PHP:** 8.2 or newer with extensions (`pdo_sqlite`, `sqlite3`, `curl`, `mbstring`, `zip`, `intl`)
- **Composer:** 2.x
- **Node.js:** 20.x or newer & npm

### 2. Setup & Installation
Clone or navigate to the project directory:
```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install

# Setup environment configuration
cp .env.example .env
php artisan key:generate

# Run database migrations and seed default tactics, formations, roles, and zones
php artisan migrate:fresh --seed
```

### 3. Start Development Servers
Run the Laravel application server and Vite asset bundler:
```bash
# Terminal 1: Laravel backend server
php artisan serve

# Terminal 2: Vite hot-reload dev server
npm run dev
```

Visit **`http://127.0.0.1:8000`** in your browser.

---

---

## ⚡ Vercel Serverless Deployment (SQLite Bundled di `/tmp`)

The application is pre-configured for zero-setup serverless deployment on **Vercel Functions** using `vercel-community/php` (`vercel-php@0.7.2`).

### 1. Architectural Strategy
- **SQLite Bundled:** The pre-seeded database file (`database/database.sqlite`) is tracked in Git and packaged via `includeFiles` in `vercel.json`.
- **Auto-Copy to `/tmp`:** On serverless cold starts, `AppServiceProvider` automatically copies the database into `/tmp/database.sqlite` (with write permissions) and sets `PRAGMA journal_mode = MEMORY;` to avoid ephemeral lock/WAL crashes.
- **Client-Side Zero-Loss Persistence:** Custom user tactics are stored in `localStorage` via `resources/js/utils/localTacticsStorage.js` with instant JSON export/import and Web Share API support.

### 2. Steps to Deploy on Vercel
1. Push your repository to GitHub.
2. In the **Vercel Dashboard**:
   - Import your GitHub repository.
   - Set **Framework Preset** to `Other` (or leave default).
   - Set **Build Command** to `npm run build` (or `npm run vercel-build`).
   - Set **Output Directory** to `public`.
3. In **Settings > Environment Variables**, add:
   - `APP_KEY`: Generate locally with `php artisan key:generate --show` (e.g. `base64:...`).
   - `AI_ASSISTANT_ENABLED`: `false`
4. Deploy!

### 3. Verification & Observability
Check deployment and runtime health instantly by visiting:
```
https://your-vercel-domain.vercel.app/api/health
```
This standalone endpoint verifies:
- PHP version & `pdo_sqlite` extension
- Bundled SQLite database presence and size
- `/tmp/database.sqlite` copy status and table row counts (`formations`)
- Compiled Vite manifest presence in `public/build/manifest.json`
- `APP_KEY` presence in environment variables

---

## 🧪 Testing & Verification

The project includes automated feature tests for the backend (PHPUnit) and component/engine tests for the frontend (Vitest):

```bash
# Run Laravel backend feature tests
php artisan test

# Run React & Canvas unit tests
npm test -- --run

# Run linter
npm run lint

# Build production assets
npm run build
```

---

## ⚙️ Configuration & Feature Flags

Feature flags are centralized in `config/features.php`:

```php
return [
    'ai_assistant_enabled' => (bool) env('AI_ASSISTANT_ENABLED', false),
];
```

To enable or disable the AI Assistant module, modify `.env`:
```env
AI_ASSISTANT_ENABLED=false
```
When set to `false`, AI-related buttons, tabs, and modal components are completely removed from the DOM and Inertia state.

---

## 📄 License
This project is open-source software licensed under the [MIT license](LICENSE).
