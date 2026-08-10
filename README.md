# 📋 TacticBoard

Aplikasi **TacticBoard** berbasis website adalah papan strategi digital interaktif untuk merancang, menyimulasikan, dan membagikan formasi atau taktik olahraga (fokus pada sepak bola) secara real-time.

---

## 🚀 Fitur Utama (Core Features)

* **Drag-and-Drop Player**: Menggeser posisi pemain dan objek di atas lapangan secara instan.
* **Drawing Tools**: Menggambar garis pergerakan, anak panah, dan zona taktik dengan berbagai warna.
* **Preset Formasi & Gaya Bermain**: Pilihan formasi standar (misal: 4-3-3, 4-2-3-1) dan preset gaya bermain dengan lebih dari 45 peran (*role*) pemain spesifik.
* **Animasi & Simulasi Taktik Dinamis**: Pergerakan pemain secara otomatis merespon berdasarkan 4 fase permainan (Possession, Transition +, Transition -, Defense) sesuai dengan role yang ditetapkan pada preset.
* **AI Chatbot Asisten Pelatih**: Integrasi Chatbot cerdas bertenaga Groq API yang dirancang khusus untuk memberikan saran dan wawasan seputar taktik sepak bola.
* **Ekspor & Berbagi**: Menyimpan papan taktik.

---

## 🛠️ Tech Stack & Arsitektur

### Teknologi Utama
* **Frontend**: React.js (Vite), HTML5 Canvas, Vanilla CSS (Responsive Grid)
* **Backend**: Node.js (Express) untuk proxy API Chatbot
* **AI Provider**: Groq API (Model: `openai/gpt-oss-120b`)

### Struktur Folder Utama
```text
├── src/                  # Kode sumber Frontend (React)
│   ├── components/       # Komponen UI (Toolbar, Lapangan, Modals)
│   ├── hooks/            # Logika drawing canvas, simulasi pergerakan, dan drag-and-drop
│   ├── data/             # Konfigurasi data statis (Formasi, Preset Role, dll)
│   └── utils/            # Fungsi utilitas (Kalkulasi pergerakan pemain)
├── backend/              # Kode sumber Backend (Node.js)
│   ├── controllers/      # Logika API Chatbot
│   └── routes/           # Endpoint API
```

---

## 📦 Prasyarat & Instalasi

### Prasyarat
* **Node.js** v18 atau versi terbaru
* **npm** atau **yarn**
* **Groq API Key** (Untuk fitur AI Chatbot)

### Langkah Instalasi

1. **Clone Repositori & Masuk ke Folder**
   ```bash
   git clone https://github.com/sayaMahasiswa24/Tacticbord.git
   cd Tacticbord
   ```

2. **Instal Dependensi Frontend & Backend**
   ```bash
   npm install
   cd backend && npm install
   cd ..
   ```

3. **Konfigurasi Variabel Lingkungan (.env)**
   Buat file `.env` di folder `backend/` dan masukkan API Key Groq Anda:
   ```env
   PORT=5000
   GROQ_API_KEY=api_key_groq_anda_di_sini
   ```
   *(Opsional) Sesuaikan base URL API pada frontend jika menggunakan port berbeda.*

4. **Jalankan Aplikasi (Mode Pengembangan)**
   Jalankan frontend:
   ```bash
   npm run dev
   ```
   Di terminal baru, jalankan backend:
   ```bash
   cd backend
   npm run dev
   ```
   Buka [http://localhost:5173](http://localhost:5173) (atau port Vite Anda) di browser.

---

## 💻 Cara Penggunaan (Usage Examples)

### 1. Merancang Formasi & Gaya Bermain
* Gunakan menu drop-down **Formasi** untuk menyusun posisi 11 pemain.
* Klik tombol **Gaya Main** (ikon roda gigi) untuk memilih preset gaya bermain (misal: *Gegenpressing*, *Tiki-Taka*). Ini akan otomatis mengatur role untuk setiap pemain.

### 2. Mensimulasikan Taktik Berdasarkan Fase
* Pilih fase permainan di toolbar atas: **Possession**, **Transisi (+)**, **Transisi (-)**, atau **Defense**.
* Pemain akan otomatis bergerak merespons formasi dan *role* mereka di fase tersebut.

### 3. Menggambar Manual
* Pilih alat **Spidol** di menu kanan/bawah untuk menggambar jalur berlari atau umpan.

### 4. Berkonsultasi dengan AI
* Buka panel **AI Chat** dari header.
* Tanyakan strategi, analisis kelemahan formasi lawan, atau tips taktik sepak bola kepada asisten AI.

---

## 🗺️ Roadmap Pengembangan

* [x] Fitur dasar drag-and-drop dan drawing canvas.
* [x] Integrasi Preset Gaya Bermain & 45+ Role Pemain.
* [x] Simulasi pergerakan pemain dinamis berdasarkan fase permainan.
* [x] Integrasi AI Chatbot untuk asisten pelatih (Groq API).
* [x] Layout UI yang responsif (memaksimalkan tampilan layar lebar/desktop).
* [ ] **Fitur Berikutnya**: Kolaborasi real-time multi-coach via WebSockets.
* [ ] **Fitur Berikutnya**: Menyimpan preset kustom pengguna.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** - lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.
