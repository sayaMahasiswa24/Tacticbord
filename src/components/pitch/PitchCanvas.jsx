import React, { useEffect } from 'react';
import PitchSidebar from '../layout/PitchSidebar';

const PitchCanvas = ({
  zoom, setZoom,
  mcRef, drawcRef, trashRef,
  drawTool, dragId, overTrash,
  isLandscape, getPointerCoords,
  onDown, onMove, onUp,        
  onDrawStart, onDrawMove, onDrawEnd,
  curFId,
  phase, triggerPhase, simSpd, setSimSpd,
  overlays, setOverlays
}) => {
  
  // Event Listener Touch untuk HP/Tablet
  useEffect(() => {
    const canvasMC = mcRef.current; 
    const canvasDC = drawcRef.current;
    if(!canvasMC || !canvasDC) return;
    
    // --- TOUCH UNTUK DRAG PEMAIN ---
    const handleTouchStartMC = (e) => { const t = e.touches[0]; const { x, y } = getPointerCoords(t.clientX, t.clientY); if(onDown(x, y)) e.preventDefault(); };
    const handleTouchMoveMC = (e) => { const t = e.touches[0]; const { x, y } = getPointerCoords(t.clientX, t.clientY); onMove(x, y, t.clientX, t.clientY); if(dragId !== null) e.preventDefault(); };
    const handleTouchEndMC = (e) => { const t = e.changedTouches[0]; const { x, y } = getPointerCoords(t.clientX, t.clientY); onUp(x, y, t.clientX, t.clientY); };
    
    // --- TOUCH UNTUK SPIDOL/DRAWING ---
    const handleTouchStartDC = (e) => { if(drawTool === 'select') return; const t = e.touches[0]; const { x, y } = getPointerCoords(t.clientX, t.clientY); onDrawStart(x, y); e.preventDefault(); };
    const handleTouchMoveDC = (e) => { if(drawTool === 'select') return; const t = e.touches[0]; const { x, y } = getPointerCoords(t.clientX, t.clientY); onDrawMove(x, y, canvasDC); e.preventDefault(); };
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
  }, [curFId, getPointerCoords, onDown, onMove, onUp, onDrawStart, onDrawMove, onDrawEnd, dragId, drawTool, mcRef, drawcRef]);

  return (
    <div className="main">
      <div className="pitch-col">
        <PitchSidebar 
          phase={phase} triggerPhase={triggerPhase}
          simSpd={simSpd} setSimSpd={setSimSpd}
          overlays={overlays} setOverlays={setOverlays}
          zoom={zoom} setZoom={setZoom}
        />
        <div className="pitch-wrap">
          <div className="canvas-zoom-wrapper" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}>
            {/* Kanvas Pemain */}
            <canvas ref={mcRef} width={isLandscape ? 580 : 460} height={isLandscape ? 460 : 580} id="mc" 
              style={{ touchAction: drawTool !== 'select' ? 'none' : 'auto' }}
              onMouseDown={(e) => { const { x, y } = getPointerCoords(e.clientX, e.clientY); if(onDown(x, y)) e.preventDefault(); }}
              onMouseMove={(e) => { const { x, y } = getPointerCoords(e.clientX, e.clientY); onMove(x, y, e.clientX, e.clientY); }}
              onMouseUp={(e) => { const { x, y } = getPointerCoords(e.clientX, e.clientY); onUp(x, y, e.clientX, e.clientY); }}
            />
            {/* Kanvas Spidol */}
            <canvas ref={drawcRef} width={isLandscape ? 580 : 460} height={isLandscape ? 460 : 580} id="drawc" 
              className={drawTool !== 'select' ? 'pen-active' : ''} 
              style={{ touchAction: drawTool !== 'select' ? 'none' : 'auto', pointerEvents: drawTool === 'select' ? 'none' : 'auto' }} 
              onMouseDown={(e) => { const { x, y } = getPointerCoords(e.clientX, e.clientY); onDrawStart(x, y); }}
              onMouseMove={(e) => { const { x, y } = getPointerCoords(e.clientX, e.clientY); onDrawMove(x, y, drawcRef.current); }}
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