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

## 🐳 Docker Deployment

The application includes a production-grade multi-stage `Dockerfile` and `docker-compose.yml` that packages PHP 8.2-FPM, Nginx, built Vite assets, and SQLite into a single container.

### Deploy with Docker Compose:
```bash
# Build and start container in detached mode
docker compose up --build -d
```
Access the application at **`http://localhost:8000`** (or specify `PORT=80` in `.env`).

### Persistent Data:
- The SQLite database is mounted to a named Docker volume (`tacticbord-db`), ensuring that all saved tactics and WAL logs persist across container restarts and updates.

To stop the container:
```bash
docker compose down
```

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
