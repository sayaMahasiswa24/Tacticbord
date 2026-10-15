import React, { useEffect, useRef, useState } from 'react';
import PitchSidebar from '../layout/PitchSidebar';
import RightSidebar from '../layout/RightSidebar';

// Dimensi logis lapangan (portrait mode)
const CANVAS_W = 460;
const CANVAS_H = 580;

// DPR di-clamp maksimal 3 agar tidak OOM di monitor 4K
function getSafeDPR() {
  return Math.min(window.devicePixelRatio || 1, 3);
}

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
  setIsBrowserOpen, setIsSaveOpen, setIsLoadOpen,
  renderPitch, redrawDrawings
}) => {

  // ── Dimensi kanvas fisik (piksel) berdasarkan orientasi & DPR aman ─────────
  const dpr = getSafeDPR();
  const logicalW = isLandscape ? CANVAS_H : CANVAS_W;
  const logicalH = isLandscape ? CANVAS_W : CANVAS_H;
  const canvasW = Math.round(logicalW * dpr);
  const canvasH = Math.round(logicalH * dpr);

  // Pantau perubahan dpr (misal laptop pindah ke monitor eksternal)
  const [, setDprTick] = useState(0);
  useEffect(() => {
    const update = () => setDprTick(t => t + 1);
    const mql = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  // ── Touch event listeners (passive:false agar bisa preventDefault) ──────
  useEffect(() => {
    const canvasMC = mcRef.current; 
    const canvasDC = drawcRef.current;
    if (!canvasMC || !canvasDC) return;

    const handleTouchStartMC = (e) => {
      const t = e.touches[0];
      const { x, y } = getPointerCoords(t.clientX, t.clientY);
      if (onDown(x, y)) e.preventDefault();
    };
    const handleTouchMoveMC = (e) => {
      const t = e.touches[0];
      const { x, y } = getPointerCoords(t.clientX, t.clientY);
      onMove(x, y, t.clientX, t.clientY);
      if (dragId !== null) e.preventDefault();
    };
    const handleTouchEndMC = (e) => {
      const t = e.changedTouches[0];
      const { x, y } = getPointerCoords(t.clientX, t.clientY);
      onUp(x, y, t.clientX, t.clientY);
    };
    const handleTouchStartDC = (e) => {
      if (drawTool === 'select') return;
      const t = e.touches[0];
      const { x, y } = getPointerCoords(t.clientX, t.clientY);
      onDrawStart(x, y);
      e.preventDefault();
    };
    const handleTouchMoveDC = (e) => {
      if (drawTool === 'select') return;
      const t = e.touches[0];
      const { x, y } = getPointerCoords(t.clientX, t.clientY);
      onDrawMove(x, y, canvasDC);
      e.preventDefault();
    };
    const handleTouchEndDC = () => {
      if (drawTool !== 'select') onDrawEnd(canvasDC);
    };
    
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

  // ── Fit-to-container: lapangan selalu proporsional di semua device ─────────
  const wrapRef = useRef(null);
  const [wrapSize, setWrapSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) {
      setWrapSize({ w: r.width, h: r.height });
    }
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect && rect.width > 0 && rect.height > 0) {
        setWrapSize(prev => {
          if (Math.abs(prev.w - rect.width) < 0.5 && Math.abs(prev.h - rect.height) < 0.5) return prev;
          return { w: rect.width, h: rect.height };
        });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Rasio lebar/tinggi lapangan: portrait = 460/580, landscape = 580/460
  const pitchRatio = isLandscape ? CANVAS_H / CANVAS_W : CANVAS_W / CANVAS_H;
  // Padding aman 8px agar tidak pernah terpotong / memicu scrollbar saat zoom 1.0
  const availW = Math.max((wrapSize.w || CANVAS_W) - 8, 10);
  const availH = Math.max((wrapSize.h || CANVAS_H) - 8, 10);
  let baseW = availW;
  let baseH = availH;
  if (baseW > 0 && baseH > 0) {
    if (baseW / baseH > pitchRatio) {
      baseW = baseH * pitchRatio; // dibatasi oleh tinggi
    } else {
      baseH = baseW / pitchRatio; // dibatasi oleh lebar
    }
  }
  const finalW = Math.floor(Math.max(baseW * zoom, 10));
  const finalH = Math.floor(Math.max(baseH * zoom, 10));

  // Pastikan pitch & coretan selalu di-render ulang saat dimensi atau rotasi berubah
  useEffect(() => {
    if (mcRef.current) {
      renderPitch?.();
    }
    if (drawcRef.current) {
      redrawDrawings?.(drawcRef.current);
    }
  }, [canvasW, canvasH, finalW, finalH, isLandscape, renderPitch, redrawDrawings]);

  // touch-action diextract agar tidak di-evaluasi berulang di JSX
  const drawingTouchAction = drawTool !== 'select' ? 'none' : 'auto';

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
          roster={roster} addPlayer={addPlayer} addPlayers={addPlayers}
          updatePlayer={updatePlayer} deletePlayer={deletePlayer}
          scenario={scenario}
          setIsBrowserOpen={setIsBrowserOpen}
          setIsSaveOpen={setIsSaveOpen}
          setIsLoadOpen={setIsLoadOpen}
        />

        {/* ── Lapangan + kanvas gambar ── */}
        <div
          className="pitch-wrap"
          ref={wrapRef}
          style={{ overflow: zoom > 1.02 ? 'auto' : 'hidden' }}
        >
          <div
            className="canvas-zoom-wrapper"
            style={{ 
              width: `${finalW}px`,
              height: `${finalH}px`,
              margin: 'auto',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            {/* Kanvas utama: lapangan + pion pemain */}
            <canvas
              ref={mcRef}
              id="mc"
              width={canvasW}
              height={canvasH}
              style={{ touchAction: drawingTouchAction }}
              onMouseDown={(e) => {
                const { x, y } = getPointerCoords(e.clientX, e.clientY);
                if (onDown(x, y)) e.preventDefault();
              }}
              onMouseMove={(e) => {
                const { x, y } = getPointerCoords(e.clientX, e.clientY);
                onMove(x, y, e.clientX, e.clientY);
              }}
              onMouseUp={(e) => {
                const { x, y } = getPointerCoords(e.clientX, e.clientY);
                onUp(x, y, e.clientX, e.clientY);
              }}
            />
            {/* Kanvas anotasi: garis taktik & panah */}
            <canvas
              ref={drawcRef}
              id="drawc"
              width={canvasW}
              height={canvasH}
              className={drawTool !== 'select' ? 'pen-active' : ''}
              style={{
                touchAction: drawingTouchAction,
                pointerEvents: drawTool === 'select' ? 'none' : 'auto',
              }}
              onMouseDown={(e) => {
                const { x, y } = getPointerCoords(e.clientX, e.clientY);
                onDrawStart(x, y);
              }}
              onMouseMove={(e) => {
                const { x, y } = getPointerCoords(e.clientX, e.clientY);
                onDrawMove(x, y, drawcRef.current);
              }}
              onMouseUp={() => onDrawEnd(drawcRef.current)}
              onMouseLeave={() => onDrawEnd(drawcRef.current)}
            />
          </div>
        </div>

        {/* ── Hint bar ── */}
        <div className="hint-bar">
          <i className="ti ti-drag-drop" /> Seret pion · Ketuk pilih peran
        </div>

        {/* ── Playback controls untuk Scenario / Fase ── */}
        {scenario && scenario.layers.length > 0 && (
          <div className="playback-controls">
            <button
              className="playback-btn"
              onClick={scenario.prevPhase}
              disabled={scenario.currentLayerIndex === 0}
              style={{ opacity: scenario.currentLayerIndex === 0 ? 0.3 : 1 }}
              aria-label="Fase sebelumnya"
            >
              <i className="ti ti-player-skip-back" />
            </button>

            {scenario.isPlaying && !scenario.isPaused ? (
              <button
                className="playback-btn playback-btn--play"
                onClick={scenario.pauseScenario}
                aria-label="Jeda"
              >
                <i className="ti ti-player-pause" />
              </button>
            ) : (
              <button
                className="playback-btn playback-btn--play"
                onClick={() => {
                  if (scenario.isPaused) scenario.resumeScenario();
                  else scenario.playScenario();
                }}
                aria-label="Putar"
              >
                <i className="ti ti-player-play" />
              </button>
            )}

            <button
              className="playback-btn"
              onClick={scenario.nextPhase}
              disabled={scenario.currentLayerIndex >= scenario.layers.length - 1}
              style={{ opacity: scenario.currentLayerIndex >= scenario.layers.length - 1 ? 0.3 : 1 }}
              aria-label="Fase berikutnya"
            >
              <i className="ti ti-player-skip-forward" />
            </button>

            <div className="playback-counter">
              Fase {scenario.currentLayerIndex + 1} / {scenario.layers.length}
            </div>
          </div>
        )}

        {/* ── Trash zone: muncul saat drag pion ── */}
        <div
          ref={trashRef}
          className={`trash-zone ${dragId !== null ? 'show' : ''} ${overTrash ? 'hover' : ''}`}
        >
          <i className="ti ti-trash" />
        </div>
      </div>
    </div>
  );
};

export default PitchCanvas;