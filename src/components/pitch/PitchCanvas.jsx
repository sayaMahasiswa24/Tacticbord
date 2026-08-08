import React, { useEffect } from 'react';

const PitchCanvas = ({
  zoom, setZoom,
  mcRef, drawcRef, trashRef,
  drawTool, dragId, overTrash,
  getScale, onDown, onMove, onUp, curFId
}) => {
  
  // Memindahkan event listener touch dari App.jsx ke sini
  useEffect(() => {
    const canvas = mcRef.current; 
    if(!canvas) return;
    
    const handleTouchStart = (e) => { 
      const t = e.touches[0]; 
      const { sx, sy, rect } = getScale(); 
      if(onDown((t.clientX - rect.left) * sx, (t.clientY - rect.top) * sy)) e.preventDefault(); 
    };
    
    const handleTouchMove = (e) => { 
      const t = e.touches[0]; 
      const { sx, sy, rect } = getScale(); 
      onMove((t.clientX - rect.left) * sx, (t.clientY - rect.top) * sy, t.clientX, t.clientY); 
      if(dragId !== null) e.preventDefault(); 
    };
    
    const handleTouchEnd = (e) => { 
      const t = e.changedTouches[0]; 
      const { sx, sy, rect } = getScale(); 
      onUp((t.clientX - rect.left) * sx, (t.clientY - rect.top) * sy, t.clientX, t.clientY); 
    };
    
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    
    return () => { 
      canvas.removeEventListener('touchstart', handleTouchStart); 
      canvas.removeEventListener('touchmove', handleTouchMove); 
      canvas.removeEventListener('touchend', handleTouchEnd); 
    };
  }, [curFId, getScale, onDown, onMove, onUp, dragId, mcRef]);

  return (
    <div className="main">
      <div className="pitch-col">
        {/* Tombol Zoom */}
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))}>+</button>
          <button className="zoom-btn" onClick={() => setZoom(1)} style={{fontSize: '11px', fontWeight: 'bold'}}>1x</button>
          <button className="zoom-btn" onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}>-</button>
        </div>
        
        <div className="pitch-wrap">
          <div className="canvas-zoom-wrapper" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}>
            {/* Kanvas Utama (Pemain, Formasi, Animasi) */}
            <canvas ref={mcRef} width={460} height={580} id="mc" 
              style={{ touchAction: drawTool !== 'select' ? 'none' : 'auto' }}
              onMouseDown={(e) => { const { sx, sy, rect } = getScale(); if(onDown((e.clientX - rect.left)*sx, (e.clientY - rect.top)*sy)) e.preventDefault(); }}
              onMouseMove={(e) => { const { sx, sy, rect } = getScale(); onMove((e.clientX - rect.left)*sx, (e.clientY - rect.top)*sy, e.clientX, e.clientY); }}
              onMouseUp={(e) => { const { sx, sy, rect } = getScale(); onUp((e.clientX - rect.left)*sx, (e.clientY - rect.top)*sy, e.clientX, e.clientY); }}
            />
            {/* Kanvas Coretan (Drawing) */}
            <canvas ref={drawcRef} width={460} height={580} id="drawc" 
              className={drawTool !== 'select' ? 'pen-active' : ''} 
              style={{ touchAction: drawTool !== 'select' ? 'none' : 'auto' }} 
            />
          </div>
        </div>

        <div className="hint-bar"><i className="ti ti-drag-drop"></i> Seret pion · Ketuk pilih peran</div>
        
        {/* Ikon Tong Sampah (Muncul saat pemain diseret) */}
        <div ref={trashRef} className={`trash-zone ${dragId !== null ? 'show' : ''} ${overTrash ? 'hover' : ''}`}>
          <i className="ti ti-trash"></i>
        </div>
      </div>
    </div>
  );
};

export default PitchCanvas;