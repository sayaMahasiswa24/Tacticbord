import React from 'react';

const BottomBar = ({ 
  drawTool, setDrawTool, drawColor, setDrawColor, clearDrawings,
  isHoldingReset, startHoldReset, cancelHoldReset, resetHoldProgress 
}) => {
  return (
    <div className="bottombar">
      <div className="bb-group">
        <span className="bb-label">Spidol:</span>
        <button className={`pen-btn ${drawTool === 'select' ? 'on' : ''}`} onClick={() => setDrawTool('select')} aria-label="Mode pilih/geser"><i className="ti ti-pointer"></i><span className="btn-txt">Pilih/Geser</span></button>
        <button className={`pen-btn ${drawTool === 'pen' ? 'on' : ''}`} onClick={() => setDrawTool('pen')} aria-label="Alat spidol bebas"><i className="ti ti-pencil"></i><span className="btn-txt">Coret Bebas</span></button>
        <button className={`pen-btn ${drawTool === 'arrow' ? 'on' : ''}`} onClick={() => setDrawTool('arrow')} aria-label="Alat panah"><i className="ti ti-arrow-up-right"></i><span className="btn-txt">Panah</span></button>
        <div className="color-group">
          <button className={`color-swatch ${drawColor === '#fbbf24' ? 'active' : ''}`} style={{background:'#fbbf24'}} onClick={() => setDrawColor('#fbbf24')} aria-label="Warna kuning"></button>
          <button className={`color-swatch ${drawColor === '#ffffff' ? 'active' : ''}`} style={{background:'#ffffff'}} onClick={() => setDrawColor('#ffffff')} aria-label="Warna putih"></button>
          <button className={`color-swatch ${drawColor === '#ff3333' ? 'active' : ''}`} style={{background:'#ff3333'}} onClick={() => setDrawColor('#ff3333')} aria-label="Warna merah"></button>
        </div>
        <button className="pen-btn" onClick={clearDrawings} aria-label="Hapus coretan"><i className="ti ti-eraser"></i><span className="btn-txt">Hapus Semua</span></button>
      </div>
      
      <button className={`reset-btn ${isHoldingReset ? 'holding' : ''}`}
        onMouseDown={startHoldReset} onMouseUp={cancelHoldReset} onMouseLeave={cancelHoldReset}
        onTouchStart={startHoldReset} onTouchEnd={cancelHoldReset}
      >
        <div className="reset-progress" style={{width: `${resetHoldProgress}%`}}></div>
        <i className="ti ti-refresh"></i><span>Tahan 1s untuk Reset</span>
      </button>
    </div>
  );
};

export default BottomBar;