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

## AI Tactical Assistant — Tool-Use, bukan Context-Stuffing

`POST /api/chat` **tidak** menjejalkan seluruh `role_master` ke setiap prompt.
Sebaliknya, Claude diberi **tools** untuk query database sendiri saat butuh —
lebih akurat dan lebih hemat token untuk dataset terstruktur seperti ini
(dibanding vector-embedding RAG, yang lebih cocok untuk dokumen bebas/tidak terstruktur).

**File terkait:**
- `backend/utils/aiTools.js` — skema 5 tool + fungsi eksekusinya
- `backend/controllers/chat.controller.js` — *agentic loop* yang memanggil Anthropic API

**5 tools yang tersedia untuk Claude:**

| Tool | Kapan dipanggil Claude |
|---|---|
| `search_roles(query, posType?)` | User tanya "role apa yang cocok untuk..." tanpa sebut nama role |
| `get_role_detail(roleId)` | Butuh atribut lengkap satu role spesifik |
| `get_role_rules(roleId)` | Pertanyaan soal interaksi antar role (butuh tabel `role_conditional_rules` terisi) |
| `list_style_presets()` | Rekomendasi gaya bermain |
| `get_formation(formationId)` | Detail susunan slot formasi lain |

**Alur teknis:**
```
1. Backend kirim system prompt (konteks papan aktif) + daftar tools ke Claude
2. Kalau stop_reason === 'tool_use' → backend eksekusi query SQL yang diminta
3. Hasil query dikirim balik sebagai tool_result
4. Ulangi maksimal 5 ronde (guard rail cegah loop tak berkesudahan)
5. Begitu Claude tidak lagi minta tool → itu jawaban akhir, dikirim ke frontend
```

**Catatan penting**: deskripsi role di database berbahasa Indonesia, dan
`search_roles` pakai `LIKE` (substring literal, bukan semantik). Tool
description sudah diarahkan eksplisit supaya Claude mencari pakai kata kunci
Indonesia ("turun" bukan "drop deep") dan coba sinonim lain kalau query
pertama nihil hasil.

**Test tanpa API key asli** (verifikasi mekanisme lokal):
```bash
cd backend
node --experimental-sqlite --input-type=module -e "
import { executeTool } from './utils/aiTools.js';
console.log(executeTool('search_roles', { query: 'menahan bola', posType: 'CF' }));
"
```

---

## Langkah Selanjutnya

### Opsional — tingkatkan akurasi simulasi
Backend sudah siap menerima tabel `role_phase_movement` dan `role_conditional_rules`
— begitu diisi (dari prompt 03-11 yang sudah dibuat sebelumnya), endpoint
`/api/roles/:roleId/movement` dan `/rules` langsung mengembalikan data lebih presisi,
dan tool `get_role_rules` yang sudah dibangun otomatis ikut lebih berguna.

### Opsional — dokumen taktik tidak terstruktur (RAG murni)
Kalau nanti kamu tambahkan materi taktik dalam bentuk dokumen bebas (artikel,
e-book coaching, transkrip analisis) — bukan data tabel seperti sekarang —
barulah vector RAG (chunking + embedding + vector store) jadi pendekatan yang tepat,
melengkapi (bukan menggantikan) sistem tool-use yang sudah ada.

### Belum dikerjakan — fitur login user
Untuk kontrol data per-pengguna (tiap pelatih punya taktik & role custom sendiri),
backend perlu ditambah: tabel `users`, autentikasi (JWT/session), dan setiap
tabel yang bersifat personal (`saved_tactics`, mungkin juga `role_master` kalau
role custom per-user) perlu kolom `user_id` + middleware otentikasi di routes terkait.

