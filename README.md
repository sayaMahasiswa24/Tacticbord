# TacticBord

Papan taktik sepak bola interaktif dengan simulasi pergerakan pemain berbasis
29 role taktis nyata (Regista, False Nine, Inverted Winger, dll), lengkap
dengan asisten AI untuk analisis formasi.

## Struktur Proyek

```
Tacticbord/
├── src/                  ← Frontend React (Vite)
│   ├── App.jsx           ← Seluruh logika papan taktik & canvas
│   └── services/api.js   ← Pemanggilan ke backend
├── backend/               ← Backend API + database + proxy AI
│   ├── server.js
│   ├── db/                ← Skema & data role_master, zone_coordinate_map
│   └── Dockerfile
├── Dockerfile             ← Build frontend (multi-stage, disajikan via Nginx)
├── docker-compose.yml     ← Orkestrasi frontend + backend
└── nginx.conf
```

## Jalankan Secara Lokal

**1. Backend** (wajib jalan duluan — frontend butuh ini untuk fitur AI Chat & data role)
```bash
cd backend
cp .env.example .env
# isi ANTHROPIC_API_KEY di .env dengan API key asli
npm install
npm start
```

**2. Frontend**
```bash
npm install
cp .env.example .env   # pastikan VITE_BACKEND_URL mengarah ke backend di atas
npm run dev
```

## Jalankan dengan Docker

```bash
cp backend/.env.example .env
# isi ANTHROPIC_API_KEY di .env
docker compose up --build
```

Frontend akan tersedia di `http://localhost:3000`, backend di `http://localhost:8787`.

## Fitur Utama

- **29 role taktis** dari `role_master` — setiap posisi punya sub-peran lengkap
  dengan atribut `width_tendency`, `depth_tendency`, `pressing_intensity`, dll.
- **Simulasi 4 fase permainan**: In Possession, Counter-attack, Gegenpressing,
  Out of Possession — posisi pemain dihitung otomatis dari atribut role-nya.
- **Drag & drop posisi** — geser pion, posisi (GK/CB/CM/dst) berubah otomatis
  sesuai zona lapangan.
- **Mode spidol** — gambar bebas/panah di atas lapangan untuk anotasi taktik.
- **Asisten Taktik AI** — chat dengan AI yang membaca konteks formasi & role
  yang sedang aktif untuk memberi saran (API key disimpan aman di backend,
  tidak pernah di browser).
- **Simpan/Muat taktik** — tersimpan di localStorage browser.

## Stack Teknologi

- Frontend: React 19 + Vite, canvas 2D untuk rendering papan taktik
- Backend: Node.js (Express) + `node:sqlite` bawaan (tanpa dependency native)
- Deploy: Docker multi-stage build, disajikan via Nginx
