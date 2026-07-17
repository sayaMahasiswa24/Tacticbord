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

## Ringkasan Endpoint yang Tersedia

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/health` | Cek status server & jumlah data |
| GET | `/api/roles?posType=CB&search=press` | List role, bisa difilter |
| GET | `/api/roles/:roleId` | Detail satu role |
| GET | `/api/roles/:roleId/movement` | Data phase_movement (kalau sudah diisi) |
| GET | `/api/roles/:roleId/rules` | Conditional rules role tsb |
| GET | `/api/zones?name=zone_10&side=left` | List zona, bisa difilter |
| GET | `/api/tactics` | List taktik tersimpan |
| GET | `/api/tactics/:id` | Detail satu taktik |
| POST | `/api/tactics` | Simpan taktik baru |
| DELETE | `/api/tactics/:id` | Hapus taktik |
| POST | `/api/chat` | Kirim pesan ke AI agent (key aman di server) |

---

## Langkah Selanjutnya (opsional, tingkatkan akurasi AI)

Backend ini sudah siap menerima tabel `role_phase_movement`, `role_conditional_rules`,
dan `role_formation_override` — begitu kamu isi CSV-nya (dari prompt 03-11 yang
sudah dibuat sebelumnya), tinggal buat script seed serupa `db/index.js` untuk
tabel-tabel itu, dan endpoint `/api/roles/:roleId/movement` serta `/rules` akan
langsung mengembalikan data yang lebih presisi — tanpa perlu ubah frontend sama sekali.
