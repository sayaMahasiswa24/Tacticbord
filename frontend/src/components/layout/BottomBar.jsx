import React, { useState, useRef, useEffect } from 'react';

const BottomBar = ({
  drawTool, setDrawTool, drawColor, setDrawColor, clearDrawings, undoDrawing,
  isHoldingReset, startHoldReset, cancelHoldReset, resetHoldProgress
}) => {
  const [isColorOpen, setIsColorOpen] = useState(false);
  const colorPickerRef = useRef(null);

  const tools = [
    { id: 'select', icon: 'ti-pointer',        label: 'Pilih/Geser' },
    { id: 'pen',    icon: 'ti-pencil',          label: 'Coret Bebas' },
    { id: 'arrow',  icon: 'ti-arrow-up-right',  label: 'Panah' },
    { id: 'dash',   icon: 'ti-arrow-right-dashed', label: 'Panah Putus' },
    { id: 'curve',  icon: 'ti-arrow-curve-right', label: 'Panah Lengkung' },
    { id: 'line',   icon: 'ti-minus',            label: 'Garis' },
  ];

  const colors = [
    { hex: '#fbbf24', label: 'Warna kuning' },
    { hex: '#ffffff', label: 'Warna putih' },
    { hex: '#ef4444', label: 'Warna merah' },
    { hex: '#38bdf8', label: 'Warna biru' },
    { hex: '#4ade80', label: 'Warna hijau' },
  ];

  // Tutup popup warna saat klik di luar
  useEffect(() => {
    if (!isColorOpen) return;
    const handleOutside = (e) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
        setIsColorOpen(false);
      }
    };
    window.addEventListener('pointerdown', handleOutside);
    return () => window.removeEventListener('pointerdown', handleOutside);
  }, [isColorOpen]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Tacticbord',
          text: 'Lihat formasi dan taktik ini di Tacticbord!',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan disalin ke clipboard!');
    }
  };

  return (
    <div className="bottombar">
      <div className="bb-group">
        <span className="bb-label">Spidol:</span>
        {tools.map(t => (
          <button
            key={t.id}
            className={`pen-btn ${drawTool === t.id ? 'on' : ''}`}
            onClick={() => setDrawTool(t.id)}
            aria-label={t.label}
            title={t.label}
          >
            <i className={`ti ${t.icon}`}></i>
            <span className="btn-txt">{t.label}</span>
          </button>
        ))}

        <div className="bb-divider"></div>

        {/* Color Picker Popover — hemat ruang horizontal di mobile */}
        <div className="color-picker-container" ref={colorPickerRef}>
          <button
            className={`pen-btn color-trigger-btn ${isColorOpen ? 'on' : ''}`}
            onClick={() => setIsColorOpen(prev => !prev)}
            aria-label="Pilih warna coretan"
            title="Pilih warna"
          >
            <span
              className="color-trigger-dot"
              style={{ background: drawColor }}
            />
          </button>

          {isColorOpen && (
            <div className="color-picker-popover" role="dialog" aria-label="Pilihan warna">
              {colors.map(c => (
                <button
                  key={c.hex}
                  className={`color-swatch ${drawColor === c.hex ? 'active' : ''}`}
                  style={{ background: c.hex }}
                  onClick={() => {
                    setDrawColor(c.hex);
                    setIsColorOpen(false);
                  }}
                  aria-label={c.label}
                />
              ))}
            </div>
          )}
        </div>

        <div className="bb-divider"></div>

        <button className="pen-btn" onClick={undoDrawing} aria-label="Undo coretan terakhir" title="Undo">
          <i className="ti ti-arrow-back-up"></i>
          <span className="btn-txt">Undo</span>
        </button>
        <button className="pen-btn" onClick={clearDrawings} aria-label="Hapus coretan" title="Hapus Semua Coretan">
          <i className="ti ti-eraser"></i>
          <span className="btn-txt">Hapus Semua</span>
        </button>
        <button className="pen-btn" onClick={handleShare} aria-label="Bagikan" title="Bagikan">
          <i className="ti ti-share"></i>
          <span className="btn-txt">Bagikan</span>
        </button>
      </div>

      <button className={`reset-btn ${isHoldingReset ? 'holding' : ''}`}
        onMouseDown={startHoldReset} onMouseUp={cancelHoldReset} onMouseLeave={cancelHoldReset}
        onTouchStart={startHoldReset} onTouchEnd={cancelHoldReset}
        title="Tahan untuk reset formasi"
        aria-label="Reset formasi"
      >
        <div className="reset-progress" style={{ width: `${resetHoldProgress}%` }}></div>
        <i className="ti ti-refresh"></i><span className="btn-txt">Reset</span>
      </button>
    </div>
  );
};

export default BottomBar;