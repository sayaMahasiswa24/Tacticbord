import React from 'react';

const TutorialModal = ({ isTutorialOpen, setIsTutorialOpen }) => {
  if (!isTutorialOpen) return null;

  return (
    <div className="overlay open" onClick={(e) => { if (e.target === e.currentTarget) setIsTutorialOpen(false); }}>
      <div className="modal wide">
        <div className="mh">
          <div style={{ fontSize: 24 }}>🎓</div>
          <div><div className="mtitle">Selamat Datang di Tacticbord!</div><div className="msub">Panduan Singkat Penggunaan</div></div>
          <button className="mclose" onClick={() => setIsTutorialOpen(false)}>&#x2715;</button>
        </div>
        <div className="mb">
          <div className="rg">
            <div className="rl">Fitur Utama</div>
            <div className="ro" style={{ cursor: 'default' }}>
              <div className="ro-n">👆 Drag & Drop Pemain</div>
              <div className="ro-d">Tahan dan geser pemain untuk mengatur posisi sesuka hati. Seret pemain ke tempat sampah untuk menghapusnya.</div>
            </div>
            <div className="ro" style={{ cursor: 'default' }}>
              <div className="ro-n">⚙️ Atur Peran (Role)</div>
              <div className="ro-d">Klik pemain untuk membuka menu dan memilih peran spesifik (seperti Inverted Winger atau Ball-Playing Defender).</div>
            </div>
            <div className="ro" style={{ cursor: 'default' }}>
              <div className="ro-n">🖍️ Coretan / Menggambar</div>
              <div className="ro-d">Gunakan alat pena di bagian bawah untuk menggambar pola serangan atau arah lari pemain di lapangan.</div>
            </div>
            <div className="ro" style={{ cursor: 'default' }}>
              <div className="ro-n">▶️ Simulasi Taktik</div>
              <div className="ro-d">Buka panel di sebelah kiri layar untuk menjalankan simulasi taktik berdasarkan peran yang telah diberikan.</div>
            </div>
            <div className="ro" style={{ cursor: 'default' }}>
              <div className="ro-n">🤖 AI Tactic Assistant</div>
              <div className="ro-d">Gunakan tombol AI di pojok kanan atas untuk bertanya tentang strategi, formasi, dan tips sepak bola lainnya!</div>
            </div>
          </div>
        </div>
        <div className="mf"><button className="ok" onClick={() => setIsTutorialOpen(false)}>Mulai Menggunakan Tacticbord</button></div>
      </div>
    </div>
  );
};

export default TutorialModal;
