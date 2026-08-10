# 📋 TacticBoard

Aplikasi **TacticBoard** berbasis website adalah papan strategi digital interaktif untuk merancang, menyimulasikan, dan membagikan formasi atau taktik olahraga (seperti sepak bola, basket, atau futsal) secara real-time.

---

## 🚀 Fitur Utama (Core Features)

* **Drag-and-Drop Player**: Menggeser posisi pemain dan objek di atas lapangan secara instan.
* **Drawing Tools**: Menggambar garis pergerakan, anak panah, dan zona taktik dengan berbagai warna.
* **Preset Formasi**: Pilihan formasi standar (misal: 4-4-2, 4-3-3) yang bisa langsung diterapkan.
* **Animasi Taktik**: Membuat rangkaian gerakan per frame untuk menyimulasikan strategi permainan.
* **Ekspor & Berbagi**: Menyimpan papan taktik dalam format gambar (PNG/JPEG) atau membagikannya lewat tautan unik.

---

## 🛠️ Tech Stack & Arsitektur

### Teknologi Utama
* **Frontend**: HTML5 Canvas / SVG, React.js / Vue.js, Tailwind CSS
* **Backend**: Node.js (Express) / Python (FastAPI)
* **Real-time Sync**: Socket.io (untuk kolaborasi multi-user)

### Struktur Folder Utama
```text
├── src/
│   ├── components/       # Komponen UI (Toolbar, Lapangan, Pemain)
│   ├── hooks/            # Logika drawing canvas dan drag-and-drop
│   ├── context/          # State management untuk formasi dan taktik
│   └── assets/           # Gambar aset lapangan dan ikon olahraga
```

---

## 📦 Prasyarat & Instalasi

### Prasyarat
* **Node.js** v18 atau versi terbaru
* **npm** atau **yarn**

### Langkah Instalasi

1. **Clone Repositori**
   ```bash
   git clone https://github.com/username/tacticboard.git
   cd tacticboard
   ```

2. **Instal Dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi Variabel Lingkungan (.env)**
   Buat file `.env` di root folder dan sesuaikan variabelnya:
   ```env
   PORT=3000
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. **Jalankan Aplikasi (Mode Pengembangan)**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 💻 Cara Penggunaan (Usage Examples)

### 1. Memilih Lapangan & Formasi
* Klik ikon **Lapang/Pitch** di toolbar samping untuk memilih jenis olahraga.
* Gunakan menu drop-down **Formasi** untuk langsung menyusun posisi 11 pemain secara otomatis.

### 2. Menggambar Taktik
* Pilih alat **Pen** untuk menggambar garis lari bebas.
* Pilih alat **Arrow** untuk menggambar arah operan bola.

---

## 🗺️ Roadmap Pengembangan

* [x] Fitur dasar drag-and-drop dan drawing canvas.
* [x] Fitur ekspor gambar (PNG).
* [ ] **Fitur Berikutnya**: Kolaborasi real-time multi-coach via WebSockets.
* [ ] **Fitur Berikutnya**: Mode animasi multi-frame (Play/Pause taktik).
* [ ] **Fitur Berikutnya**: Aplikasi mobile (PWA support).

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** - lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.
