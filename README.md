# 🏆 TacticBoard — Interactive Digital Strategy Board for Football

![React 18](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.5.0-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.19.2-000000?style=flat-square&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Native_Node-003B57?style=flat-square&logo=sqlite&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0.0-646CFF?style=flat-square&logo=vite&logoColor=white)
![Groq AI](https://img.shields.io/badge/AI_Engine-Groq_API-F55036?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)

> **TacticBoard** adalah papan strategi sepak bola digital interaktif berbasis web untuk merancang, menyimulasikan pergerakan fase taktik, menganalisis ruang lapangan, mengelola skuad, hingga berkonsultasi dengan asisten taktik berbasis AI secara *real-time*.

---

## 📑 Daftar Isi
- [Tentang Proyek](#-tentang-proyek)
- [Tech Stack](#-tech-stack)
- [Fitur yang Telah Dikerjakan](#-fitur-yang-telah-dikerjakan)
- [Struktur Proyek](#-struktur-proyek)
- [Prasyarat Sistem](#-prasyarat-sistem)
- [Panduan Instalasi & Menjalankan Aplikasi](#-panduan-instalasi--menjalankan-aplikasi)
- [Konfigurasi Environment Variable](#-konfigurasi-environment-variable)
- [Lisensi](#-lisensi)

---

## 📖 Tentang Proyek

TacticBoard dirancang untuk para pelatih, analis, pemain, dan penggemar sepak bola yang membutuhkan media taktik modern dan responsif. Aplikasi ini berjalan langsung di browser tanpa ketergantungan software berat, mendukung perangkat desktop, tablet, hingga smartphone (mobile-first) dengan performa grafis tinggi berbasis HTML5 Canvas 2D.

---

## 🛠️ Tech Stack

### Frontend
- **Framework & Core:** [React 18](https://react.dev/) (Hooks, Context, Memoization)
- **Build Tool & Dev Server:** [Vite 6](https://vitejs.dev/) (HMR kilat, optimasi bundle ES modules)
- **Grafis & Rendering:** HTML5 Canvas 2D API (High-DPR pixel mapping, touch gesture handling, anti-aliased geometry)
- **Styling:** Vanilla CSS3 Modern (CSS Variables, Flexbox, CSS Grid, Glassmorphism, CSS Transitions & Keyframe Animations)
- **Iconography:** [Tabler Icons](https://tabler.io/icons)
- **Typography:** Google Fonts (*Poppins* & *JetBrains Mono*)
- **Fitur Tambahan:** `react-auto-google-translate` untuk multi-bahasa, Web Share API untuk berbagi taktik instan.

### Backend
- **Runtime:** [Node.js](https://nodejs.org/) (versi `>=22.5.0` memanfaatkan fitur native `--experimental-sqlite`)
- **Web Framework:** [Express.js](https://expressjs.com/)
- **Database:** SQLite (Embedded DB via modul native `node:sqlite`)
- **AI & LLM Integration:** [Groq Cloud API](https://groq.com/) (Model LLM berkecepatan tinggi dengan integrasi *Function Calling / Tools Execution*)
- **Security & Utilities:** `cors`, `dotenv`

### DevOps & Deployment
- **Containerization:** Docker & Docker Compose
- **Web Server & Reverse Proxy:** Nginx (untuk production serving)

---

## ✨ Fitur yang Telah Dikerjakan

Berikut rangkuman fitur dan modul yang telah selesai diimplementasikan selama proses pengembangan:

### 1. 🏟️ Interactive Canvas Pitch Engine
- **Skala Dinamis & Anti-Pecah:** Kanvas otomatis menyesuaikan orientasi (Portrait 460×580 & Landscape 580×460) dengan penskalaan DPR (*Device Pixel Ratio*) dinamis, menjaga visual tetap tajam tanpa memakan RAM berlebih di layar resolusi tinggi (Retina/4K).
- **Auto-Fit Container Responsif:** Menggunakan `ResizeObserver` untuk memastikan seluruh lapangan pas di dalam layar tanpa memicu scrollbar yang tidak diinginkan.
- **Dukungan Orientasi Penuh:** Mendukung rotasi layar otomatis saat pengguna memiringkan smartphone/tablet ke mode landscape.

### 2. ⚽ Formasi & Preset Gaya Bermain (Play Styles)
- **Pilihan Formasi Baku:** 4-3-3, 4-2-3-1, 3-5-2, 4-4-2, 5-3-2, 4-1-4-1, dll.
- **Preset Taktik Terkenal:**
  - *Tiki-Taka* (Posisi tinggi, umpan pendek terkoordinasi)
  - *Gegenpressing* (Blok tinggi, intensitas pressing agresif)
  - *Counter Attack* (Transisi kilat dari pertahanan rendah)
  - *Catenaccio / Park the Bus* (Pertahanan berlapis dan kompak)
- **Indikator Gaya Aktif:** Dropdown dan trigger modal untuk memilih, mengaplikasikan, dan melepas gaya bermain.

### 3. 👤 Pion Pemain, Peran (Roles), & Drag-and-Drop
- **Interaksi Drag-and-Drop:** Geser pion pemain dengan mouse atau sentuhan jari (*multi-touch friendly*).
- **Zona Sampah (Trash Zone):** Tarik pion ke arah bawah untuk menghapus pemain dari lapangan secara visual.
- **Sistem Role & Tugas Lengkap:** Modal pemilihan peran pemain spesifik (misal: *Inverted Winger, Ball-Playing Defender, Regista, Mezzala, Box-to-Box, Sweeper Keeper, Target Forward*).
- **Pion Musuh (Opponent/Enemies):** Opsi menambahkan pion lawan (bergaris putus-putus merah) untuk simulasi duel dan skema pressing.

### 4. ✏️ Alat Anotasi & Spidol Taktik (Drawing Tools)
- **Beragam Alat Coretan:**
  - `Select/Pointer` (Mode geser pion)
  - `Pen` (Coretan bebas)
  - `Arrow` (Panah lurus untuk pergerakan lari)
  - `Dashed Arrow` (Panah putus-putus untuk arah umpan bola)
  - `Curved Arrow` (Panah lengkung untuk lari melingkar / overlap)
  - `Line` (Garis pembatas posisi)
- **Color Picker Popover Cerdas:** Palet warna mengambang (Kuning, Putih, Merah, Biru, Hijau) yang hemat ruang dan ramah layar mobile.
- **Undo & Clear:** Tombol urungkan goresan terakhir atau bersihkan seluruh papan coretan dalam 1 klik.
- **Bagikan (Web Share API):** Bagikan taktik langsung via aplikasi media sosial atau salin tautan instan.

### 5. ⏱️ Simulasi Pergerakan & Fase Taktik (Simulation Engine)
- **Simulasi 3 Fase Permainan:**
  - *Fase 1: Build-up* (Fase membangun serangan dari lini belakang)
  - *Fase 2: Progression* (Fase progresi bola di lini tengah)
  - *Fase 3: Final Third* (Fase penetrasi dan penyelesaian akhir)
- **Pengaturan Kecepatan Simulasi:** Opsi kecepatan `0.5x`, `1.0x`, dan `2.0x`.
- **Overlay Taktis:**
  - *Zone Bands:* Membagi lapangan ke dalam 5 koridor horizontal (Zona 1 s/d Zona 5).
  - *Pass Network:* Jaringan garis konektivitas operan otomatis antar pemain yang berdekatan.

### 6. 🎬 Multi-Phase Scenario & Keyframe Player
- Menyimpan *layer* langkah-langkah taktik berurutan.
- Kontrol pemutar playback (*Play, Pause, Skip Back, Skip Forward*) dengan indikator fase aktif (`Fase X / Y`).
- Animasi transisi antar fase taktik yang mulus.

### 7. 📋 Manajemen Skuad (Team Roster System)
- Panel sidebar kanan untuk mencatat daftar pemain tim cadangan dan utama.
- Pengaturan nomor punggung, nama lengkap, dan posisi utama pemain.
- Tambah, sunting, dan hapus pemain dari daftar roster.

### 8. 🤖 Asisten Taktik Berbasis AI (AI Tactical Coach)
- Modal obrolan taktik interaktif terintegrasi dengan backend.
- Memanfaatkan LLM berperforma tinggi via **Groq Cloud API**.
- Dilengkapi **Domain Guarding** (fokus 100% pada analisis taktik sepak bola) dan sistem **Function Calling** (`get_role_detail`, `search_roles`, dll.) untuk membaca data role langsung dari database.

### 9. 💾 Penyimpanan Taktik (Save, Load, & Export)
- Simpan formasi kustom dan catatan strategi ke `localStorage` browser.
- Muat kembali strategi yang pernah dibuat sebelumnya.
- Fitur **Hold-to-Reset** dengan progress bar visual untuk mencegah reset taktik yang tidak sengaja.

### 10. 📱 Desain Responsif & Mobile-First
- Sidebar kiri (kontrol fase, simulasi, zoom) dan kanan (roster) otomatis berada dalam kondisi tertutup (*collapsed*) saat pertama kali dimuat di layar kecil agar lapangan terlihat maksimal.
- Transisi *slide-in* halus ketika sidebar dibuka.
- Bottombar aksi yang otomatis mengunci tombol Reset di sisi kanan dan mendukung *smooth swipe* horizontal untuk alat gambar di layar smartphone (360px–412px).
- Modal tutorial interaktif untuk memandu pengguna baru.

---

## 🏗️ Struktur Proyek

```plaintext
Tacticbord/
├── backend/
│   ├── controllers/         # Handler route API
│   ├── data/                # Data mentah & referensi formasi/role
│   ├── db/                  # Inisialisasi & seeder SQLite
│   ├── middleware/          # Express middleware (CORS, error handling)
│   ├── routes/              # Definisi endpoint REST API
│   ├── services/            # Logika bisnis & integrasi Groq AI Service
│   ├── utils/               # AI function tools & helper
│   ├── .env.example         # Template environment backend
│   ├── package.json         # Dependensi backend
│   └── server.js            # Entry point backend server
│
├── frontend/
│   ├── public/              # Aset statis & logo
│   ├── src/
│   │   ├── assets/          # Ikon dan gambar
│   │   ├── components/
│   │   │   ├── layout/      # Header, BottomBar, PitchSidebar, RightSidebar
│   │   │   ├── modals/      # RoleAssign, AIChat, Save/Load, Style, Tutorial
│   │   │   └── pitch/       # PitchCanvas (Core 2D Pitch & Layers)
│   │   ├── data/            # Preset formasi, warna pion, dan zona taktik
│   │   ├── hooks/           # Custom React Hooks (Drag, Draw, Sim, Scenario, Roster, Zoom)
│   │   ├── utils/           # Helper matematika koordinat & warna
│   │   ├── App.css          # Styling utama, responsivitas, dan animasi
│   │   ├── App.jsx          # Root component & orkestrasi state taktik
│   │   ├── index.css        # Reset CSS & token tipografi
│   │   └── main.jsx         # React DOM mount point
│   ├── index.html           # Template HTML utama
│   ├── package.json         # Dependensi frontend
│   └── vite.config.js       # Konfigurasi Vite & PWA plugin
│
├── docker-compose.yml       # Konfigurasi deployment multi-container
├── Dockerfile               # Blueprint build image Docker
├── nginx.conf               # Konfigurasi Nginx proxy
└── README.md                # Dokumentasi proyek
```

---

## 📝 Prasyarat Sistem

Sebelum menjalankan proyek, pastikan komputer Anda telah terinstal:
- **Node.js** versi **>= 22.5.0** (dibutuhkan untuk modul built-in `node:sqlite` di backend)
- **npm** versi **>= 10.0.0**
- *(Opsional)* **Docker & Docker Compose** jika ingin menjalankan via container

---

## 📦 Panduan Instalasi & Menjalankan Aplikasi

### 1. Clone Repositori
```bash
git clone https://github.com/sayaMahasiswa24/Tacticbord.git
cd Tacticbord
```

---

### 2. Menjalankan Frontend

Masuk ke folder `frontend`:
```bash
cd frontend
npm install
npm run dev
```
Aplikasi frontend akan aktif di: **`http://localhost:5173`** (atau port yang tertera di terminal).

---

### 3. Menjalankan Backend (API & AI Agent)

Buka terminal baru, masuk ke folder `backend`:
```bash
cd backend
npm install
```

Salin file environment dan masukkan API Key:
```bash
cp .env.example .env
```
> Buka file `.env` dan masukkan API Key dari [Groq Console](https://console.groq.com/) pada variabel `GROQ_API_KEY`.

Jalankan database seeder (pertama kali saja):
```bash
npm run seed
```

Jalankan backend server:
```bash
npm run dev
```
Server backend akan berjalan di: **`http://localhost:5000`**.

---

### 4. Menjalankan dengan Docker (Opsional)

Jika ingin menjalankan seluruh sistem (Frontend + Backend + Nginx) menggunakan Docker Compose:
```bash
docker-compose up --build
```
Aplikasi siap diakses melalui browser pada port yang dikonfigurasikan di `docker-compose.yml`.

---

## 🔐 Konfigurasi Environment Variable

### Backend (`backend/.env`)
| Variabel | Deskripsi | Contoh Nilai |
|---|---|---|
| `PORT` | Port server Express | `5000` |
| `GROQ_API_KEY` | API Key Groq untuk asisten taktik AI | `gsk_xxxxxxxxxxxxxxxxxxxx` |
| `DATABASE_PATH` | Lokasi file database SQLite | `./db/tacticbord.db` |
| `FRONTEND_URL` | URL frontend untuk whitelist CORS | `http://localhost:5173` |

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi **ISC**. Silakan baca file [LICENSE](LICENSE) untuk informasi lebih lanjut.