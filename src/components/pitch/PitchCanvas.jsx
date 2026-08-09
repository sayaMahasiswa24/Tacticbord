import React, { useEffect } from 'react';

const PitchCanvas = ({
  zoom, setZoom,
  mcRef, drawcRef, trashRef,
  drawTool, dragId, overTrash,
  getScale, 
  onDown, onMove, onUp,        
  onDrawStart, onDrawMove, onDrawEnd,
  curFId
}) => {
  
  // Event Listener Touch untuk HP/Tablet
  useEffect(() => {
    const canvasMC = mcRef.current; 
    const canvasDC = drawcRef.current;
    if(!canvasMC || !canvasDC) return;
    
    // --- TOUCH UNTUK DRAG PEMAIN ---
    const handleTouchStartMC = (e) => { const t = e.touches[0]; const { sx, sy, rect } = getScale(); if(onDown((t.clientX - rect.left)*sx, (t.clientY - rect.top)*sy)) e.preventDefault(); };
    const handleTouchMoveMC = (e) => { const t = e.touches[0]; const { sx, sy, rect } = getScale(); onMove((t.clientX - rect.left)*sx, (t.clientY - rect.top)*sy, t.clientX, t.clientY); if(dragId !== null) e.preventDefault(); };
    const handleTouchEndMC = (e) => { const t = e.changedTouches[0]; const { sx, sy, rect } = getScale(); onUp((t.clientX - rect.left)*sx, (t.clientY - rect.top)*sy, t.clientX, t.clientY); };
    
    // --- TOUCH UNTUK SPIDOL/DRAWING ---
    const handleTouchStartDC = (e) => { if(drawTool === 'select') return; const t = e.touches[0]; const { sx, sy, rect } = getScale(); onDrawStart((t.clientX - rect.left)*sx, (t.clientY - rect.top)*sy); e.preventDefault(); };
    const handleTouchMoveDC = (e) => { if(drawTool === 'select') return; const t = e.touches[0]; const { sx, sy, rect } = getScale(); onDrawMove((t.clientX - rect.left)*sx, (t.clientY - rect.top)*sy, canvasDC); e.preventDefault(); };
    const handleTouchEndDC = () => { if(drawTool !== 'select') onDrawEnd(canvasDC); };

    canvasMC.addEventListener('touchstart', handleTouchStartMC, { passive: false });
    canvasMC.addEventListener('touchmove', handleTouchMoveMC, { passive: false });
    canvasMC.addEventListener('touchend', handleTouchEndMC);
    
    canvasDC.addEventListener('touchstart', handleTouchStartDC, { passive: false });
    canvasDC.addEventListener('touchmove', handleTouchMoveDC, { passive: false });
    canvasDC.addEventListener('touchend', handleTouchEndDC);
    
    return () => { 
      canvasMC.removeEventListener('touchstart', handleTouchStartMC); canvasMC.removeEventListener('touchmove', handleTouchMoveMC); canvasMC.removeEventListener('touchend', handleTouchEndMC); 
      canvasDC.removeEventListener('touchstart', handleTouchStartDC); canvasDC.removeEventListener('touchmove', handleTouchMoveDC); canvasDC.removeEventListener('touchend', handleTouchEndDC); 
    };
  }, [curFId, getScale, onDown, onMove, onUp, onDrawStart, onDrawMove, onDrawEnd, dragId, drawTool, mcRef, drawcRef]);

  return (
    <div className="main">
      <div className="pitch-col">
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))}>+</button>
          <button className="zoom-btn" onClick={() => setZoom(1)} style={{fontSize: '11px', fontWeight: 'bold'}}>1x</button>
          <button className="zoom-btn" onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}>-</button>
        </div>
        
        <div className="pitch-wrap">
          <div className="canvas-zoom-wrapper" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}>
            {/* Kanvas Pemain */}
            <canvas ref={mcRef} width={460} height={580} id="mc" 
              style={{ touchAction: drawTool !== 'select' ? 'none' : 'auto' }}
              onMouseDown={(e) => { const { sx, sy, rect } = getScale(); if(onDown((e.clientX - rect.left)*sx, (e.clientY - rect.top)*sy)) e.preventDefault(); }}
              onMouseMove={(e) => { const { sx, sy, rect } = getScale(); onMove((e.clientX - rect.left)*sx, (e.clientY - rect.top)*sy, e.clientX, e.clientY); }}
              onMouseUp={(e) => { const { sx, sy, rect } = getScale(); onUp((e.clientX - rect.left)*sx, (e.clientY - rect.top)*sy, e.clientX, e.clientY); }}
            />
            {/* Kanvas Spidol */}
            <canvas ref={drawcRef} width={460} height={580} id="drawc" 
              className={drawTool !== 'select' ? 'pen-active' : ''} 
              style={{ touchAction: drawTool !== 'select' ? 'none' : 'auto', pointerEvents: drawTool === 'select' ? 'none' : 'auto' }} 
              onMouseDown={(e) => { const { sx, sy, rect } = getScale(); onDrawStart((e.clientX - rect.left)*sx, (e.clientY - rect.top)*sy); }}
              onMouseMove={(e) => { const { sx, sy, rect } = getScale(); onDrawMove((e.clientX - rect.left)*sx, (e.clientY - rect.top)*sy, drawcRef.current); }}
              onMouseUp={() => onDrawEnd(drawcRef.current)}
              onMouseLeave={() => onDrawEnd(drawcRef.current)}
            />
          </div>
        </div>

        <div className="hint-bar"><i className="ti ti-drag-drop"></i> Seret pion · Ketuk pilih peran</div>
        <div ref={trashRef} className={`trash-zone ${dragId !== null ? 'show' : ''} ${overTrash ? 'hover' : ''}`}><i className="ti ti-trash"></i></div>
      </div>
    </div>
  );
};

export default PitchCanvas;