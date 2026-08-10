# Dokumentasi Integrasi AI Chatbot - TacticBord

Dokumen ini berisi rancangan arsitektur, spesifikasi *prompt*, dan kode dasar untuk mengintegrasikan asisten analis taktik AI ke dalam aplikasi TacticBord. Sistem dirancang menggunakan pendekatan *microservices* untuk memisahkan logika utama dengan mesin pemrosesan AI.

---

## 1. Arsitektur Sistem (Microservices)

Untuk menjaga performa animasi pergerakan pemain di *frontend* (React) agar tetap instan, beban kerja dibagi menjadi dua *service*:

1.  **Main Service (TypeScript / NestJS):** 
    *   Menangani validasi sesi pengguna dan kuota harian (menggunakan Redis).
    *   Menarik data koordinat dari *database* (hasil konversi CSV) berbasis struktur *Object-Oriented Programming* (OOP) untuk dikirim langsung ke *frontend*.
    *   Memancarkan *event* simulasi ke *message broker* (RabbitMQ).
2.  **AI Engine Service (Python / FastAPI):**
    *   Mendengarkan *event* dari RabbitMQ.
    *   Melakukan pencarian teori taktik ke *Vector Database* (Metode RAG).
    *   Mengembalikan analisis teks (maksimal 2 kalimat) untuk ditampilkan pada fitur *chat* aplikasi.

---

## 2. Kebutuhan Sistem (Dependencies)

Untuk menjalankan AI Engine Service, diperlukan pengaturan *environment* Python.

**File `requirements.txt`:**
```text
fastapi==0.110.1
uvicorn==0.29.0
langchain==0.1.16
langchain-openai==0.1.3
langchain-chroma==0.1.0
pydantic==2.7.0
python-dotenv==1.0.1