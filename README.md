# ⚽ TacticBoard

TacticBoard adalah aplikasi papan strategi digital interaktif berbasis web yang dirancang khusus untuk pelatih, analis, dan penggemar sepak bola. Aplikasi ini memudahkan Anda untuk merancang, menyimulasikan, dan membagikan formasi serta taktik permainan secara real-time.

## ✨ Fitur Utama

- **Atur Formasi Cepat**: Pilih berbagai formasi bawaan (4-3-3, 4-4-2, 3-5-2, dll) atau geser pemain secara bebas (Drag & Drop) ke posisi manapun.
- **Simulasi Taktik**: Animasi pergerakan pemain untuk memvisualisasikan bagaimana taktik Anda akan berjalan (Bisa Play/Pause dengan pengaturan kecepatan).
- **Asisten Taktik AI**: Dilengkapi asisten cerdas yang bisa memberi masukan dan rekomendasi tentang formasi yang Anda gunakan.
- **Database Role**: Lihat dan pelajari berbagai peran spesifik setiap pemain.
- **Coretan Taktik (Drawing Tools)**: Gambar panah, jalur lari, atau area menggunakan kursor/jari secara langsung di atas papan.
- **Simpan & Muat Taktik (Save/Load)**: Simpan strategi brilian Anda agar bisa digunakan lagi di pertandingan berikutnya.
- **Gaya Bermain Preset**: Terapkan langsung taktik modern seperti *Tiki-Taka*, *Gegenpressing*, atau *Park The Bus*.

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React.js 18 & Vite
- **Styling**: CSS Asli (Vanilla CSS) agar lebih ringan dan kustom
- **Deployment**: Mendukung Vercel & GitHub Pages

## 🚀 Cara Menjalankan Secara Lokal

Untuk menjalankan proyek ini di komputer Anda, ikuti langkah berikut:

1. **Pastikan Anda memiliki Node.js terinstal** (disarankan versi LTS).
2. **Buka Terminal / Command Prompt**, lalu masuk ke folder `frontend`:
   ```bash
   cd frontend
   ```
3. **Instal seluruh dependensi**:
   ```bash
   npm install
   ```
4. **Jalankan server lokal (Development)**:
   ```bash
   npm run dev
   ```
5. Buka `http://localhost:5173/` (atau *port* yang diberikan oleh Vite) di browser Anda.

## 📦 Cara Build (Produksi)
Skrip di folder terluar sudah dikonfigurasi untuk otomatis melakukan *build* ke Vercel atau layanan *hosting* serupa.
```bash
npm run build
```
*(Perintah ini akan menjalankan instalasi, mem-build aplikasi Vite, dan memindahkan folder `dist` secara otomatis ke luar).*

---

*Dibuat untuk memudahkan analisis taktis masa depan!*
