import React, { useEffect } from 'react';
import PitchSidebar from '../layout/PitchSidebar';
import RightSidebar from '../layout/RightSidebar';

const PitchCanvas = ({
  zoom, setZoom,
  mcRef, drawcRef, trashRef,
  drawTool, dragId, overTrash,
  isLandscape, getPointerCoords,
  onDown, onMove, onUp,
  onDrawStart, onDrawMove, onDrawEnd,
  curFId,
  phase, triggerPhase, simSpd, setSimSpd,
  overlays, setOverlays,
  roster, addPlayer, addPlayers, updatePlayer, deletePlayer,
  scenario,
  setIsBrowserOpen, setIsSaveOpen, setIsLoadOpen
}) => {
  useEffect(() => {
    const canvasMC = mcRef.current; 
    const canvasDC = drawcRef.current;
    if(!canvasMC || !canvasDC) return;
    const handleTouchStartMC = (e) => { const t = e.touches[0]; const { x, y } = getPointerCoords(t.clientX, t.clientY); if(onDown(x, y)) e.preventDefault(); };
    const handleTouchMoveMC = (e) => { const t = e.touches[0]; const { x, y } = getPointerCoords(t.clientX, t.clientY); onMove(x, y, t.clientX, t.clientY); if(dragId !== null) e.preventDefault(); };
    const handleTouchEndMC = (e) => { const t = e.changedTouches[0]; const { x, y } = getPointerCoords(t.clientX, t.clientY); onUp(x, y, t.clientX, t.clientY); };
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
      canvasMC.removeEventListener('touchstart', handleTouchStartMC); 
      canvasMC.removeEventListener('touchmove', handleTouchMoveMC); 
      canvasMC.removeEventListener('touchend', handleTouchEndMC); 
      canvasDC.removeEventListener('touchstart', handleTouchStartDC); 
      canvasDC.removeEventListener('touchmove', handleTouchMoveDC); 
      canvasDC.removeEventListener('touchend', handleTouchEndDC); 
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
        <RightSidebar 
          roster={roster} addPlayer={addPlayer} addPlayers={addPlayers} updatePlayer={updatePlayer} deletePlayer={deletePlayer}
          scenario={scenario}
          setIsBrowserOpen={setIsBrowserOpen} setIsSaveOpen={setIsSaveOpen} setIsLoadOpen={setIsLoadOpen}
        />
        <div className="pitch-wrap">
          <div className="canvas-zoom-wrapper" style={{ 
            aspectRatio: isLandscape ? '580 / 460' : '460 / 580',
            width: '10000px',
            height: '10000px',
            maxWidth: `${zoom * 100}%`,
            maxHeight: `${zoom * 100}%`
          }}>
            <canvas ref={mcRef} width={isLandscape ? 580 : 460} height={isLandscape ? 460 : 580} id="mc" 
              style={{ touchAction: drawTool !== 'select' ? 'none' : 'auto' }}
              onMouseDown={(e) => { const { x, y } = getPointerCoords(e.clientX, e.clientY); if(onDown(x, y)) e.preventDefault(); }}
              onMouseMove={(e) => { const { x, y } = getPointerCoords(e.clientX, e.clientY); onMove(x, y, e.clientX, e.clientY); }}
              onMouseUp={(e) => { const { x, y } = getPointerCoords(e.clientX, e.clientY); onUp(x, y, e.clientX, e.clientY); }}
            />
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
        
        {scenario && scenario.layers.length > 0 && (
          <div className="playback-controls" style={{
            position: 'absolute',
            bottom: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(20,20,20,0.9)',
            border: '1px solid #333',
            borderRadius: '24px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 100,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}>
            <button onClick={scenario.prevPhase} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px', opacity: scenario.currentLayerIndex === 0 ? 0.3 : 1 }} disabled={scenario.currentLayerIndex === 0}>
              <i className="ti ti-player-skip-back"></i>
            </button>
            
            {scenario.isPlaying && !scenario.isPaused ? (
              <button onClick={scenario.pauseScenario} style={{ background: 'var(--blue)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                <i className="ti ti-player-pause"></i>
              </button>
            ) : (
              <button onClick={() => {
                if (scenario.isPaused) scenario.resumeScenario();
                else scenario.playScenario();
              }} style={{ background: 'var(--blue)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                <i className="ti ti-player-play"></i>
              </button>
            )}

            <button onClick={scenario.nextPhase} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px', opacity: scenario.currentLayerIndex >= scenario.layers.length - 1 ? 0.3 : 1 }} disabled={scenario.currentLayerIndex >= scenario.layers.length - 1}>
              <i className="ti ti-player-skip-forward"></i>
            </button>
            
            <div style={{ color: '#888', fontSize: '11px', fontWeight: 'bold', marginLeft: '4px', minWidth: '60px', textAlign: 'center' }}>
              Fase {scenario.currentLayerIndex + 1} / {scenario.layers.length}
            </div>
          </div>
        )}

        <div ref={trashRef} className={`trash-zone ${dragId !== null ? 'show' : ''} ${overTrash ? 'hover' : ''}`}><i className="ti ti-trash"></i></div>
      </div>
    </div>
  );
};

export default PitchCanvas;