import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css'; // Mengimpor CSS Global
import { FORMATIONS, STYLE_PRESETS, TC, TB, POS_LABEL, ICON_R_NORMAL, ICON_R_DRAG, HIT_RADIUS, ZBANDS } from './data/tacticsData';
import { getRole, lighten, ease, detectPosType, computePlayerTarget } from './utils/helpers';
import { usePitchZoom } from './hooks/usePitchZoom';
import Header from './components/layout/Header';
import PhaseToolbar from './components/layout/PhaseToolbar';
import BottomBar from './components/layout/BottomBar';
import AllModals from './components/modals/AllModals';
import PitchCanvas from './components/pitch/PitchCanvas';

export default function App() {
  const CW = 460, CH = 580;
  const PX = 18, PY = 14, PW = CW - PX * 2, PH = CH - PY * 2;
  const gx = (r) => PX + r * PW;
  const gy = (r) => PY + r * PH;
  const toRel = (cx, cy) => ({ rx: (cx - PX) / PW, ry: (cy - PY) / PH });

  // ── STATE MANAJEMEN ──
  const [curFId, setCurFId] = useState('433');
  const [players, setPlayers] = useState(() => FORMATIONS['433'].players.map(p => ({ ...p, cx: gx(p.x), cy: gy(p.y) })));
  const [assignedRoles, setAssignedRoles] = useState({});
  const [activeStyleId, setActiveStyleId] = useState(null);
  const [overlays, setOverlays] = useState({ zone: true, pass: false });
  const [phase, setPhase] = useState(null);
  const [simSpd, setSimSpd] = useState(1);
  const [drawTool, setDrawTool] = useState('select');
  const [drawColor, setDrawColor] = useState('#fbbf24');
  const [drawingPaths, setDrawingPaths] = useState([]);
  
  // Custom Hook Zoom
  const { zoom, setZoom } = usePitchZoom(1);

  // Modals & UI States
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [pendingRole, setPendingRole] = useState(null);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isLoadOpen, setIsLoadOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveNote, setSaveNote] = useState('');
  const [toastData, setToastData] = useState({ show: false, msg: '', col: '#0ea5e9' });
  const [gwRemain, setGwRemain] = useState(0);
  const [isGwActive, setIsGwActive] = useState(false);
  const [resetHoldProgress, setResetHoldProgress] = useState(0);
  const [isHoldingReset, setIsHoldingReset] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatBusy, setChatBusy] = useState(false);

  // Refs Utama
  const mcRef = useRef(null);
  const drawcRef = useRef(null);
  const trashRef = useRef(null);
  const toastTimerRef = useRef(null);
  const gwTimerRef = useRef(null);
  const resetHoldRef = useRef({ start: null, raf: null });

  // Refs Mutable untuk Drag & Animasi
  const dragRef = useRef({ id: null, dOX: 0, dOY: 0, dragging: false, moved: false, preview: null, overTrash: false, hoverId: null });
  const animRef = useRef({ pAnim: {}, running: false, start: null, rafId: null });
  const drawRef = useRef({ active: false, currentPath: null });
  const stateRef = useRef({ players, assignedRoles, overlays, phase, simSpd, drawingPaths, drawTool, drawColor, activeStyleId });

  useEffect(() => {
    stateRef.current = { players, assignedRoles, overlays, phase, simSpd, drawingPaths, drawTool, drawColor, activeStyleId };
  }, [players, assignedRoles, overlays, phase, simSpd, drawingPaths, drawTool, drawColor, activeStyleId]);

  // ── CORE LOGIC FUNCTIONS ──
  const showToast = useCallback((msg, col = '#0ea5e9') => {
    setToastData({ show: true, msg, col });
    if(toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastData(prev => ({ ...prev, show: false })), 2600);
  }, []);

  const changeFormation = (fid) => {
    stopSim(); setCurFId(fid); setAssignedRoles({}); setActiveStyleId(null);
    setPlayers(FORMATIONS[fid].players.map(p => ({ ...p, cx: gx(p.x), cy: gy(p.y) })));
  };

  const applyStyle = (styleId) => {
    const style = STYLE_PRESETS[styleId]; if(!style) return;
    stopSim(); setCurFId(style.formation);
    setPlayers(FORMATIONS[style.formation].players.map(p => ({ ...p, cx: gx(p.x), cy: gy(p.y) })));
    setAssignedRoles({ ...style.roles }); setActiveStyleId(styleId);
    setIsStyleModalOpen(false); showToast(`Gaya bermain: ${style.name}`, '#16a34a');
  };

  const clearStyle = () => { setActiveStyleId(null); showToast('Gaya bermain dilepas', '#6b7280'); };
  const clearDrawings = () => { setDrawingPaths([]); drawRef.current.currentPath = null; showToast('Coretan dihapus', '#6b7280'); };

  // ── CANVAS DRAWING ENGINE ──
  const renderPitch = useCallback(() => {
    const canvas = mcRef.current; if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const { players: curPlayers, assignedRoles: curRoles, overlays: curOverlays, phase: curPhase } = stateRef.current;
    const { id: dragPid, dragging, preview, overTrash, hoverId } = dragRef.current;

    ctx.clearRect(0, 0, CW, CH);
    // Background Lapangan
    ctx.fillStyle = '#1a5c2e'; ctx.fillRect(0,0,CW,CH);
    for(let i=0;i<6;i++){ ctx.fillStyle = i%2 ? '#1a5c2e' : '#1e6834'; ctx.fillRect(PX, PY+i*PH/6, PW, PH/6); }
    ctx.strokeStyle = 'rgba(255,255,255,.32)'; ctx.lineWidth = 1.3; ctx.strokeRect(PX, PY, PW, PH);
    ctx.beginPath(); ctx.moveTo(PX, PY+PH/2); ctx.lineTo(PX+PW, PY+PH/2); ctx.stroke();
    ctx.beginPath(); ctx.arc(PX+PW/2, PY+PH/2, 36, 0, Math.PI*2); ctx.stroke();
    
    // Draw Players
    [...curPlayers].sort((a,b)=>(a.id===dragPid?1:b.id===dragPid?-1:0)).forEach(p => {
      const roleId = curRoles[p.id];
      const isD = dragPid===p.id && dragging, isH = hoverId===p.id && !dragging;
      const col = TC[p.posType] || '#888', bdr = TB[p.posType] || '#444';
      const R = isD ? ICON_R_DRAG : ICON_R_NORMAL;
      
      ctx.beginPath(); ctx.arc(p.cx,p.cy,R,0,Math.PI*2);
      if(roleId){
        ctx.fillStyle = overTrash&&isD ? '#dc2626' : (isD?lighten(col):col);
        ctx.fill(); ctx.strokeStyle=bdr; ctx.lineWidth=isD?2.6:2.2; ctx.stroke();
      } else {
        ctx.fillStyle='rgba(255,255,255,.08)'; ctx.fill();
        ctx.strokeStyle='rgba(255,255,255,.45)'; ctx.lineWidth=1.8; ctx.setLineDash([5,3]); ctx.stroke(); ctx.setLineDash([]);
      }
      const lbl = POS_LABEL[p.posType] || p.posType;
      ctx.font='800 11.5px monospace'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillStyle= roleId ? '#ffffff' : 'rgba(255,255,255,.7)'; ctx.fillText(lbl, p.cx, p.cy);
    });
  }, []);

  const startLoop = useCallback(() => {
    if(animRef.current.rafId) return;
    const loop = (time) => {
      animRef.current.rafId = null;
      let need = false;
      if(animRef.current.running) {
        if(animRef.current.start === null) animRef.current.start = time;
        const el = (time - animRef.current.start) / 1000;
        let done = true;
        const curPlayers = [...stateRef.current.players];
        curPlayers.forEach(p => {
          const d = animRef.current.pAnim[p.id]; if(!d) return;
          const prog = d.dr <= 0 ? 1 : Math.max(0, Math.min(1, (el - d.dl) / d.dr));
          if(prog < 1) done = false;
          const et = ease(prog, d.e);
          p.cx = d.sx + (d.tx - d.sx) * et; p.cy = d.sy + (d.ty - d.sy) * et;
        });
        setPlayers(curPlayers);
        if(done) animRef.current.running = false; else need = true;
      }
      renderPitch();
      if(need) animRef.current.rafId = requestAnimationFrame(loop);
    };
    animRef.current.rafId = requestAnimationFrame(loop);
  }, [renderPitch]);

  useEffect(() => { renderPitch(); }, [players, assignedRoles, renderPitch]);

  const triggerPhase = useCallback((ph) => {
    setPhase(ph);
    const { players: curPlayers, assignedRoles: curRoles, simSpd: curSpd, activeStyleId: curStyleId } = stateRef.current;
    const styleMod = curStyleId ? STYLE_PRESETS[curStyleId]?.modifiers : null;
    const pAnim = {};
    curPlayers.forEach(p => {
      const r = getRole(curRoles[p.id]);
      const t = computePlayerTarget(p, r, ph, styleMod);
      pAnim[p.id] = { sx:p.cx, sy:p.cy, tx:gx(t.x), ty:gy(t.y), dl:t.delay/curSpd, dr:t.duration/curSpd, e:t.easing };
    });
    animRef.current.pAnim = pAnim; animRef.current.start = null; animRef.current.running = true;
    startLoop();
  }, [startLoop]);

  const stopSim = useCallback(() => { animRef.current.running = false; setPhase(null); renderPitch(); }, [renderPitch]);

  const doFullReset = useCallback(() => {
    stopSim(); setAssignedRoles({});
    setPlayers(FORMATIONS[curFId].players.map(p => ({ ...p, cx: gx(p.x), cy: gy(p.y) })));
    setIsResetConfirmOpen(false); showToast('Di-reset ke awal', '#16a34a');
  }, [curFId, stopSim, showToast]);

  const startHoldReset = () => {
    setIsHoldingReset(true); resetHoldRef.current.start = Date.now();
    const tick = () => {
      const pct = Math.min(100, ((Date.now() - resetHoldRef.current.start) / 1000) * 100);
      setResetHoldProgress(pct);
      if(pct >= 100) { doFullReset(); cancelHoldReset(); return; }
      resetHoldRef.current.raf = requestAnimationFrame(tick);
    };
    resetHoldRef.current.raf = requestAnimationFrame(tick);
  };
  const cancelHoldReset = () => { setIsHoldingReset(false); setResetHoldProgress(0); if(resetHoldRef.current.raf) cancelAnimationFrame(resetHoldRef.current.raf); };

  // ── DRAG & DROP ──
  const getScale = () => { const r = mcRef.current.getBoundingClientRect(); return { sx: CW / r.width, sy: CH / r.height, rect: r }; };
  const onDown = (mx, my) => {
    const h = stateRef.current.players.slice().reverse().find(p => Math.hypot(p.cx - mx, p.cy - my) < HIT_RADIUS);
    if(!h) return false;
    animRef.current.running = false;
    dragRef.current = { id: h.id, dOX: mx - h.cx, dOY: my - h.cy, dragging: false, moved: false, preview: null, overTrash: false, hoverId: dragRef.current.hoverId };
    return true;
  };
  const onMove = (mx, my, clientX, clientY) => {
    const { id: dragPid, dOX, dOY } = dragRef.current;
    if(dragPid !== null) {
      const curPlayers = [...stateRef.current.players];
      const p = curPlayers.find(x => x.id === dragPid);
      if(p) {
        p.cx = Math.max(PX+13, Math.min(PX+PW-13, mx - dOX)); p.cy = Math.max(PY+13, Math.min(PY+PH-13, my - dOY));
        dragRef.current.dragging = true; dragRef.current.moved = true;
        if(clientX !== undefined && trashRef.current) {
          const r = trashRef.current.getBoundingClientRect();
          dragRef.current.overTrash = clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
        }
      }
      setPlayers(curPlayers); startLoop();
    }
  };
  const onUp = (mx, my, clientX, clientY) => {
    const { id: dragPid, moved, overTrash } = dragRef.current;
    if(dragPid !== null) {
      const p = stateRef.current.players.find(x => x.id === dragPid);
      if(!moved && !overTrash && p) { setSelectedPlayer(p); setPendingRole(stateRef.current.assignedRoles[p.id] || null); }
      dragRef.current = { id: null, dOX: 0, dOY: 0, dragging: false, moved: false, preview: null, overTrash: false, hoverId: null };
      renderPitch();
    }
  };

  useEffect(() => {
    const canvas = mcRef.current; if(!canvas) return;
    const handleTouchStart = (e) => { const t = e.touches[0]; const { sx, sy, rect } = getScale(); if(onDown((t.clientX - rect.left) * sx, (t.clientY - rect.top) * sy)) e.preventDefault(); };
    const handleTouchMove = (e) => { const t = e.touches[0]; const { sx, sy, rect } = getScale(); onMove((t.clientX - rect.left) * sx, (t.clientY - rect.top) * sy, t.clientX, t.clientY); if(dragRef.current.id !== null) e.preventDefault(); };
    const handleTouchEnd = (e) => { const t = e.changedTouches[0]; const { sx, sy, rect } = getScale(); onUp((t.clientX - rect.left) * sx, (t.clientY - rect.top) * sy, t.clientX, t.clientY); };
    
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    return () => { canvas.removeEventListener('touchstart', handleTouchStart); canvas.removeEventListener('touchmove', handleTouchMove); canvas.removeEventListener('touchend', handleTouchEnd); };
  }, [curFId]);

  // Save/Load Handlers
  const saveTacticToStorage = () => { /* Logika Save (Pindah dari atas jika diperlukan) */ setIsSaveOpen(false); showToast('Taktik Disimpan!'); };
  const loadTacticFromStorage = (idx) => { /* Logika Load */ setIsLoadOpen(false); showToast('Taktik Dimuat!'); };
  const deleteSaveFromStorage = (e, idx) => { e.stopPropagation(); /* Logika Delete */ showToast('Taktik Dihapus'); };

  return (
    <div className="app-container">
      {/* Komponen Header */}
      <Header 
        curFId={curFId} changeFormation={changeFormation}
        activeStyleId={activeStyleId} setIsStyleModalOpen={setIsStyleModalOpen} clearStyle={clearStyle}
        setIsSaveOpen={setIsSaveOpen} setIsLoadOpen={setIsLoadOpen} 
        isSettingsOpen={isSettingsOpen} setIsSettingsOpen={setIsSettingsOpen}
        setIsAIChatOpen={setIsAIChatOpen} setIsBrowserOpen={setIsBrowserOpen}
      />

      {/* Komponen Toolbar Fase */}
      <PhaseToolbar 
        phase={phase} triggerPhase={triggerPhase} 
        simSpd={simSpd} setSimSpd={setSimSpd} 
        overlays={overlays} setOverlays={setOverlays} 
      />

      {/* Komponen Pitch/Lapangan Utama */}
      <div className="main">
        <div className="pitch-col">
          <div className="zoom-controls">
            <button className="zoom-btn" onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))}>+</button>
            <button className="zoom-btn" onClick={() => setZoom(1)} style={{fontSize: '11px', fontWeight: 'bold'}}>1x</button>
            <button className="zoom-btn" onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}>-</button>
          </div>
          <div className="pitch-wrap">
            <div className="canvas-zoom-wrapper" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}>
              <canvas ref={mcRef} width={460} height={580} id="mc" style={{ touchAction: drawTool !== 'select' ? 'none' : 'auto' }}
                onMouseDown={(e) => { const { sx, sy, rect } = getScale(); if(onDown((e.clientX - rect.left)*sx, (e.clientY - rect.top)*sy)) e.preventDefault(); }}
                onMouseMove={(e) => { const { sx, sy, rect } = getScale(); onMove((e.clientX - rect.left)*sx, (e.clientY - rect.top)*sy, e.clientX, e.clientY); }}
                onMouseUp={(e) => { const { sx, sy, rect } = getScale(); onUp((e.clientX - rect.left)*sx, (e.clientY - rect.top)*sy, e.clientX, e.clientY); }}
              />
              <canvas ref={drawcRef} width={460} height={580} id="drawc" className={drawTool !== 'select' ? 'pen-active' : ''} style={{ touchAction: drawTool !== 'select' ? 'none' : 'auto' }} />
            </div>
          </div>
          <div className="hint-bar"><i className="ti ti-drag-drop"></i> Seret pion · Ketuk pilih peran</div>
          <div ref={trashRef} className={`trash-zone ${dragRef.current.id !== null ? 'show' : ''} ${dragRef.current.overTrash ? 'hover' : ''}`}><i className="ti ti-trash"></i></div>
        </div>
      </div>

      {/* Komponen Bottom Bar */}
      <BottomBar 
        drawTool={drawTool} setDrawTool={setDrawTool} drawColor={drawColor} setDrawColor={setDrawColor} clearDrawings={clearDrawings}
        isHoldingReset={isHoldingReset} startHoldReset={startHoldReset} cancelHoldReset={cancelHoldReset} resetHoldProgress={resetHoldProgress} 
      />

      {/* Komponen Global Toast */}
      <div className={`toast ${toastData.show ? 'show' : ''}`}><div className="t-dot" style={{background: toastData.col}}></div><span>{toastData.msg}</span></div>

      {/* Kumpulan Modals (Popup) */}
      <AllModals 
        selectedPlayer={selectedPlayer} setSelectedPlayer={setSelectedPlayer} pendingRole={pendingRole} setPendingRole={setPendingRole} setAssignedRoles={setAssignedRoles}
        isStyleModalOpen={isStyleModalOpen} setIsStyleModalOpen={setIsStyleModalOpen} applyStyle={applyStyle} activeStyleId={activeStyleId}
        isBrowserOpen={isBrowserOpen} setIsBrowserOpen={setIsBrowserOpen}
        isSaveOpen={isSaveOpen} setIsSaveOpen={setIsSaveOpen} saveName={saveName} setSaveName={setSaveName} saveNote={saveNote} setSaveNote={setSaveNote} saveTacticToStorage={saveTacticToStorage}
        isLoadOpen={isLoadOpen} setIsLoadOpen={setIsLoadOpen} loadTacticFromStorage={loadTacticFromStorage} deleteSaveFromStorage={deleteSaveFromStorage}
        isAIChatOpen={isAIChatOpen} setIsAIChatOpen={setIsAIChatOpen} chatHistory={chatHistory} chatInput={chatInput} setChatInput={setChatInput} chatBusy={chatBusy} 
        isResetConfirmOpen={isResetConfirmOpen} setIsResetConfirmOpen={setIsResetConfirmOpen} doFullReset={doFullReset}
      />
    </div>
  );
}