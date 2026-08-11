# Laporan Pengembangan Aplikasi TacticBord

**Football Tactics Simulator — Papan Taktik Sepak Bola Interaktif**

| | |
|---|---|
| **Repositori** | `github.com/sayaMahasiswa24/Tacticbord` |
| **Status** | Aktif dikembangkan |
| **Stack** | React (Vite) + Node.js/Express + SQLite + Docker |
| **Dokumen disusun** | Berdasarkan seluruh riwayat pengembangan hingga saat ini (Diperbarui 11 Agustus 2026) |

---

## 1. Ringkasan Eksekutif

TacticBord adalah aplikasi web papan taktik sepak bola yang memungkinkan pengguna (pelatih, analis, atau penggemar taktik) menyusun formasi, menetapkan peran spesifik ke tiap pemain, dan mensimulasikan pergerakan tim secara otomatis di empat fase permainan: **In Possession**, **Counter**, **Pressing**, dan **Out of Possession**.

Yang membedakan aplikasi ini dari papan taktik pada umumnya adalah **mesin simulasi berbasis data nyata** — bukan animasi hardcoded, melainkan dihitung dari atribut taktis tiap peran (`width_tendency`, `depth_tendency`, `pressing_intensity`, dsb) yang tersimpan di database terstruktur berisi **45 peran pemain otentik** dan **54 zona lapangan** hasil riset taktik sepak bola nyata.

Aplikasi ini juga secara cerdas mendeteksi orientasi perangkat dan merespons (seperti pada tablet iPad Pro atau rotasi lanskap di *smartphone*) dengan rendering kanvas HTML5 responsif dan UI interaktif *(collapsible sidebar, floating action bar)*.

---

## 2. Latar Belakang & Tujuan

Proyek dimulai dari kebutuhan akan alat bantu visual untuk merancang dan mengomunikasikan taktik sepak bola secara lebih presisi dibanding papan taktik statis pada umumnya. Tujuan utama:

1. Menyediakan **basis data peran pemain** yang mencerminkan terminologi taktik sepak bola modern (Regista, False Nine, Inverted Winger, Libero, dsb).
2. Mensimulasikan **pergerakan tim secara dinamis** berdasarkan kombinasi peran yang dipilih pengguna.
3. Menyediakan **preset gaya bermain klasik** sebagai titik awal yang bisa disesuaikan.
4. Membangun antarmuka yang sangat responsif, presisi, dan mendukung berbagai perangkat pengguna tanpa merusak ruang interaksi taktik.

---

## 3. Arsitektur Sistem

### 3.1 Gambaran Umum

```
┌─────────────────────┐         ┌──────────────────────┐         ┌─────────────────┐
│   Frontend (React)   │ ──────▶ │   Backend (Express)   │ ──────▶ │  Anthropic API   │
│   Vite + Canvas 2D    │  REST   │   node:sqlite          │  Tool-  │  (Claude)         │
└─────────────────────┘         └──────────────────────┘         └─────────────────┘
                                            │
                                            ▼
                                  ┌──────────────────┐
                                  │  SQLite Database   │
                                  │  10 tabel relasional│
                                  └──────────────────┘
```

### 3.2 Frontend

| Aspek | Detail |
|---|---|
| Framework | React 19 + Vite |
| Rendering papan | Canvas 2D adaptif (Mendukung rotasi matriks kanvas untuk orientasi Landscape) |
| State management | React hooks + pola `stateRef` (menghindari *stale closure* di render loop canvas) |
| Styling | CSS Vanilla dalam file eksternal dengan layout dinamis responsif |
| Build output | Static bundle, disajikan lewat Nginx (multi-stage Docker build) |

### 3.3 Backend
Backend menggunakan arsitektur berlapis (routes, controllers, middleware, utils, db).
**Keputusan teknis penting**: backend menggunakan `node:sqlite` (modul bawaan Node.js 22+) alih-alih `better-sqlite3` agar tidak memerlukan dependensi kompilasi native (seperti `python3` atau `g++`), membuat image Docker lebih ringan.

### 3.4 Database
Terdapat 10 tabel relasional (seperti `role_master`, `zone_coordinate_map`, `formations`, `style_presets`, dll) untuk menyimpan meta-data peran pemain, presat gaya main, formasi, chat log, dan taktik tersimpan.

---

## 4. Timeline Pengembangan

Pengembangan berjalan melalui beberapa fase besar:

### Fase 1 – 10: Inti Papan Taktik, Database, AI Assistant & Simulasi
Meliputi pembangunan arsitektur dasar, penambahan Mode Spidol (Drawing tools), penyusunan parameter Data Simulasi, pembuatan REST API backend, dan integrasi Assistant AI menggunakan pola *Tool-Use* (lihat rincian pada laporan sebelumnya).

### Fase 11 — AI Tactical Assistant dengan Tool-Use
Setelah mengevaluasi RAG berbasis vector embedding, diputuskan pendekatan **tool-use** (function calling) lebih tepat untuk dataset terstruktur. Claude diberi 5 tools yang memanggil query SQL sesuai kebutuhan. 

### Fase 12 — Optimalisasi UI/UX & Dukungan Presisi Layar Lebar (Landscape)
Fokus ke pembaruan antarmuka (UX) signifikan pada sisi *frontend*:
- **Penggabungan Alat Navigasi**: Phase Toolbar dan Zoom Control digabungkan menjadi sebuah komponen `PitchSidebar.jsx`. Sidebar ini dapat dibuka-tutup (*collapsible*) dan menampilkan efek visual *glassmorphism* serta pendar warna sesuai fase aktif.
- **Auto-Rotasi Lapangan**: Berkat membaca `window.matchMedia('(orientation: landscape)')`, proporsi lapangan (canvas) diputar secara internal (`ctx.rotate`) saat perangkat dilebarkan. 
- **Presisi Touch**: Implementasi fungsi `getPointerCoords` memungkinkan *drag-and-drop* pemain dan coretan marker tetap presisi 100% saat lapangan berada di posisi horizontal (menyesuaikan rotasi jari/mouse).
- **Unifikasi Tata Letak (Layout)**: Menggantikan limitasi CSS grid pada mode Desktop menjadi alat desain *floating bottom-bar* seragam untuk menjamin layar taktik lebih lapang, baik di perangkat *mobile*, tablet sentris (seperti iPad Pro), maupun *desktop*.

---

## 5. Fitur Utama

### 5.1 Papan Taktik Interaktif (Responsive)
- Rendering lapangan + 11 pemain via Canvas 2D yang merespons orientasi perangkat (Portrait/Landscape).
- **Drag & drop** posisi bebas, mendukung pemetaan zona semantik otomatis.
- Visualisasi 6 pita zona dan passing network.

### 5.2 Sistem Peran (45 Role)
Setiap posisi memiliki atribut mendalam (`width_tendency`, `pressing_intensity`, dsb) yang menunjang rekayasa peran semacam Regista, False Nine, dan Inverted Winger.

### 5.3 Simulasi 4 Fase Permainan
- In Possession
- Counter
- Pressing
- Out of Possession

### 5.4 AI Tactical Assistant & Manajemen Taktik
Chat AI yang membaca konteks papan taktik serta mendukung manajemen penyimpanan formasi, ekspor/impor taktik.

---

## 6. Status Saat Ini

**Berfungsi penuh dan teruji:**
- Papan taktik interaktif dengan dukungan *drag & drop*, mode spidol coret-coret, dan **presisi pada rotasi layar horizontal otomatis**.
- Sidebar antarmuka berlapis *glassmorphism* yang *collapsible*.
- 29 peran pemain dengan CRUD lengkap, 7 formasi, 6 preset gaya bermain.
- Simulasi 4 fase permainan dan integrasi AI Assistant (5 tools).

**Skema siap, data belum diisi:**
- `role_phase_movement`, `role_conditional_rules`, `role_formation_override`, `player_squad`.

**Belum dikerjakan:**
- Autentikasi/Login pengguna.
- RAG untuk dokumen taktik tidak terstruktur.

---

## 7. Roadmap Selanjutnya

| Prioritas | Item | Kebutuhan Teknis |
|---|---|---|
| Tinggi | Isi `role_phase_movement` & `role_conditional_rules` | Gunakan 12 prompt yang sudah disiapkan, seed ke database |
| Menengah | Fitur login pengguna | Tabel `users`, autentikasi (JWT/session), kolom `user_id` di tabel personal |
| Rendah | RAG dokumen taktik tidak terstruktur | Chunking + embedding + vector store, melengkapi (bukan menggantikan) tool-use yang sudah ada |

---

*Laporan ini disusun berdasarkan riwayat pengembangan aplikasi TacticBord dan mencerminkan kondisi proyek pada titik penyusunan. Pembaruan terakhir mencakup perbaikan dan unifikasi UI/UX secara substansial pada Agustus 2026.*
