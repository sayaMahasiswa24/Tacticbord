# TacticBord Backend — Panduan Deploy

Backend ini sudah diuji langsung (bukan cuma ditulis) — semua endpoint terverifikasi
jalan: health check, roles, zones, save/load taktik, dan proxy AI chat.

## Kenapa `node:sqlite` bukan `better-sqlite3`?

`better-sqlite3` butuh kompilasi native (python3, make, g++) saat `npm install`,
yang sering gagal di image Docker minimal atau lingkungan tanpa akses build tools.
Backend ini pakai **`node:sqlite`** bawaan Node.js 22+ — nol dependency native,
image Docker jauh lebih kecil dan build lebih cepat. Satu-satunya syarat: **Node 22.5+**
dan flag `--experimental-sqlite` (sudah otomatis ada di `package.json` script).

---

## Langkah 1 — Test Lokal (tanpa Docker dulu)

```bash
cd backend
cp .env.example .env
# edit .env, isi ANTHROPIC_API_KEY dengan key asli kamu

npm install
npm start
```

Cek di browser atau curl: `http://localhost:8787/api/health`
Harus muncul `{"status":"ok","roles":29,"zones":54,...}`

---

## Langkah 2 — Test dengan Docker

```bash
# Dari root folder (sejajar dengan folder backend/)
cp backend/.env.example .env
# edit .env, isi ANTHROPIC_API_KEY

docker compose up --build
```

Database SQLite otomatis tersimpan di Docker volume `tacticbord-data`,
jadi data tidak hilang saat container di-restart.

---

## Langkah 3 — Ubah Frontend React

Di kode React kamu, cari bagian yang **langsung memanggil Anthropic API**
dari browser (yang butuh user masukkan API key sendiri). Ganti dengan
memanggil backend ini. Ini titik terpenting — sekarang **user tidak perlu
API key sama sekali**, cukup backend yang menyimpannya.

**Sebelum** (dari versi HTML lama, API key di browser):
```javascript
const res = await fetch('https://api.anthropic.com/v1/messages', {
  headers: { 'x-api-key': userProvidedApiKey, ... },
  // ...
});
```

**Sesudah** (panggil backend kamu sendiri, tanpa API key di frontend):
```javascript
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8787';

async function sendChatMessage(messages, tacticContext) {
  const res = await fetch(`${BACKEND_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,          // [{role:'user', content:'...'}, ...]
      tacticContext,      // ringkasan formasi & role aktif (string)
      sessionId: crypto.randomUUID(), // opsional, untuk log
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.reply;
}
```

Tambahkan juga fetch untuk role & zone database (opsional — bisa juga tetap
pakai data statis di frontend, tapi mengambil dari backend berarti kamu bisa
update database tanpa perlu build ulang frontend):
```javascript
async function fetchRoles(posType) {
  const url = posType
    ? `${BACKEND_URL}/api/roles?posType=${posType}`
    : `${BACKEND_URL}/api/roles`;
  const res = await fetch(url);
  return res.json();
}

async function saveTacticToServer(tactic) {
  const res = await fetch(`${BACKEND_URL}/api/tactics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tactic),
  });
  return res.json();
}
```

Buat file `.env` di root project React kamu:
```
VITE_BACKEND_URL=http://localhost:8787
```
Nanti saat production, ganti nilainya ke URL backend yang sudah di-deploy.

---

## Langkah 4 — Deploy Backend ke Hosting

Karena sudah punya Dockerfile, pilih salah satu platform yang mendukung
deploy langsung dari Dockerfile + punya persistent volume:

| Platform | Kelebihan | Catatan |
|---|---|---|
| **Railway** | Deploy dari GitHub 1-klik, volume gratis di tier awal | Paling mudah untuk pemula |
| **Render** | Free tier tersedia, auto-deploy dari GitHub | Free tier sleep setelah idle |
| **Fly.io** | Volume persisten murah, dekat dengan pengguna | Perlu install CLI `flyctl` |
| **VPS + docker compose** | Kontrol penuh, murah untuk jangka panjang | Perlu setup manual (nginx, SSL) |

**Contoh Railway (tercepat):**
1. Push folder `backend/` ke repo GitHub kamu (sudah ada, tinggal push)
2. Buka railway.app → New Project → Deploy from GitHub repo
3. Set root directory ke `backend/` jika backend bukan di root repo
4. Railway otomatis mendeteksi `Dockerfile`
5. Di tab **Variables**, tambahkan `ANTHROPIC_API_KEY` dan `CORS_ORIGIN` (isi dengan domain frontend kamu)
6. Deploy — Railway kasih URL publik otomatis, misal `tacticbord-backend.up.railway.app`
7. Update `VITE_BACKEND_URL` di frontend ke URL itu, lalu redeploy frontend

---

## Langkah 5 — Amankan sebelum push ke GitHub

```bash
# Pastikan .env TIDAK ikut ter-commit
git status
# .env seharusnya TIDAK muncul di daftar (sudah ada di .gitignore)

git add backend/ docker-compose.yml
git commit -m "Add backend API + AI agent proxy"
git push
```

Jika API key sudah pernah ter-commit sebelumnya secara tidak sengaja,
**segera revoke key itu di console.anthropic.com dan buat yang baru** —
riwayat git tetap menyimpan key lama meski file sudah dihapus.

---

## Struktur Backend (v2 — direstrukturisasi)

Backend tidak lagi satu file `server.js` raksasa — sekarang terpisah rapi:

```
backend/
├── server.js                    ← composition root (39 baris, cuma nyusun routes)
├── routes/                      ← definisi path + HTTP method
├── controllers/                 ← seluruh logika bisnis
├── middleware/errorHandler.js   ← 404 & error handler terpusat
├── utils/dto.js                 ← transformasi row SQLite ↔ JSON
└── db/
    ├── schema.sql                ← 10 tabel
    ├── index.js                  ← koneksi + orkestrasi seed
    └── seed/                     ← seluruh data awal (JSON) + logika seed
```

`FORMATIONS` dan `STYLE_PRESETS` yang dulu hardcoded di `App.jsx` sekarang
juga hidup di database (tabel `formations`+`formation_players` dan
`style_presets`+`style_preset_roles`), lengkap dengan endpoint API-nya.

## Ringkasan Endpoint API (v2)

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/health` | Status server + jumlah data tiap tabel |
| GET | `/api/roles?posType=CB&search=press` | List role, bisa difilter |
| GET | `/api/roles/:roleId` | Detail satu role |
| **POST** | **`/api/roles`** | **Buat role baru** |
| **PUT** | **`/api/roles/:roleId`** | **Update role (partial update didukung)** |
| **DELETE** | **`/api/roles/:roleId`** | **Hapus role (ditolak jika masih dipakai style preset)** |
| GET | `/api/roles/:roleId/movement` | Data role_phase_movement |
| GET | `/api/roles/:roleId/rules` | Conditional rules role tsb |
| GET | `/api/zones` / `/api/zones/:key` | List/detail zona |
| PUT | `/api/zones/:key` | Update koordinat zona |
| GET | `/api/formations` | Semua formasi (bentuk sama persis dgn `FORMATIONS` lama) |
| GET | `/api/formations/:id` | Detail satu formasi |
| PUT | `/api/formations/:id/players/:slot` | Ubah posisi satu slot pemain |
| GET | `/api/style-presets` | Semua gaya bermain |
| **POST** | **`/api/style-presets`** | **Buat gaya bermain baru** |
| PUT | `/api/style-presets/:id` | Update metadata + modifier gaya |
| PUT | `/api/style-presets/:id/roles/:slot` | Ganti role di satu slot preset |
| DELETE | `/api/style-presets/:id` | Hapus gaya bermain |
| GET/POST/DELETE | `/api/tactics` | Simpan/muat/hapus taktik |
| POST | `/api/chat` | Kirim pesan ke AI agent |

### Contoh: Update `role_master` lewat API

```bash
curl -X PUT http://localhost:8787/api/roles/poacher \
  -H "Content-Type: application/json" \
  -d '{"width": 0.40, "depth": 0.97}'
```

Partial update — field yang tidak dikirim tetap memakai nilai lama.
Validasi otomatis berlaku (posType/posGroup/overlap/pressing harus enum valid,
width/depth harus 0.0–1.0). Mencoba hapus role yang masih dipakai preset
gaya bermain akan ditolak dengan HTTP 409 demi menjaga integritas data.



---

## Langkah Selanjutnya (opsional, tingkatkan akurasi AI)

Backend ini sudah siap menerima tabel `role_phase_movement`, `role_conditional_rules`,
dan `role_formation_override` — begitu kamu isi CSV-nya (dari prompt 03-11 yang
sudah dibuat sebelumnya), tinggal buat script seed serupa `db/index.js` untuk
tabel-tabel itu, dan endpoint `/api/roles/:roleId/movement` serta `/rules` akan
langsung mengembalikan data yang lebih presisi — tanpa perlu ubah frontend sama sekali.
