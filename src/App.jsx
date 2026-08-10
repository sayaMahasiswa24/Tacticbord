import React, { useState, useRef, useCallback, useEffect } from 'react';
import './App.css';
// 1. Data & Helpers (Pastikan ZBANDS dan STYLE_PRESETS ikut ter-import)
import { FORMATIONS, TC, TB, POS_LABEL, ICON_R_NORMAL, ICON_R_DRAG, ZBANDS, STYLE_PRESETS } from './data/tacticData';
import { lighten } from './utils/helpers';
// 2. Custom Hooks
import { usePitchZoom } from './hooks/usePitchZoom';
import { useSimulation } from './hooks/useSimulation';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useDrawing } from './hooks/useDrawing';
// 3. Components
import Header from './components/layout/Header';
import PhaseToolbar from './components/layout/PhaseToolbar';
import BottomBar from './components/layout/BottomBar';
import PitchCanvas from './components/pitch/PitchCanvas';
import AllModals from './components/modals/AllModals';

export default function App() {
  // ── KONSTANTA LAPANGAN ──
  const CW = 460, CH = 580, PX = 18, PY = 14, PW = CW - PX * 2, PH = CH - PY * 2;
  const gx = useCallback((r) => PX + r * PW, [PW]);
  const gy = useCallback((r) => PY + r * PH, [PH]);
  const getScale = useCallback(() => { const r = mcRef.current?.getBoundingClientRect(); return r ? { sx: CW / r.width, sy: CH / r.height, rect: r } : { sx:1, sy:1, rect:{left:0,top:0} }; }, []);

  // ── REFS UTAMA ──
  const mcRef = useRef(null);
  const drawcRef = useRef(null);
  const trashRef = useRef(null);
  const toastTimerRef = useRef(null);
  const resetHoldRef = useRef({ start: null, raf: null });

  // ── STATES GLOBAL ──
  const [curFId, setCurFId] = useState('433');
  const [players, setPlayers] = useState(() => FORMATIONS['433'].players.map(p => ({ ...p, cx: gx(p.x), cy: gy(p.y) })));
  const [enemies, setEnemies] = useState([]);
  const enemiesRef = useRef(enemies);
  useEffect(() => { enemiesRef.current = enemies; }, [enemies]);
  const [assignedRoles, setAssignedRoles] = useState({});
  const [activeStyleId, setActiveStyleId] = useState(null);
  const [overlays, setOverlays] = useState({ zone: true, pass: false });
  const [simSpd, setSimSpd] = useState(1);
  const [toastData, setToastData] = useState({ show: false, msg: '', col: '#0ea5e9' });

  // ── STATES UI MODALS ──
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [pendingRole, setPendingRole] = useState(null);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isLoadOpen, setIsLoadOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveNote, setSaveNote] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatBusy, setChatBusy] = useState(false);
  const [isHoldingReset, setIsHoldingReset] = useState(false);
  const [resetHoldProgress, setResetHoldProgress] = useState(0);

  // ── INIT CUSTOM HOOKS ──
  const { zoom, setZoom } = usePitchZoom(1);
  
  // PENYEBAB ERROR KEMARIN: drawingPaths belum dikeluarkan di sini, sekarang sudah ada.
  const { drawTool, setDrawTool, drawColor, setDrawColor, drawingPaths, clearDrawings, handleDrawStart, handleDrawMove, handleDrawEnd, redrawDrawings } = useDrawing();
  
  const { dragRef, onDown: dragDown, onMove: dragMove, onUp: dragUp } = useDragAndDrop(
    players, setPlayers, assignedRoles, setAssignedRoles, setSelectedPlayer, setPendingRole, 
    () => animRef?.current?.startLoop?.(), 
    () => renderPitch(), 
    PX, PY, PW, PH
  );

  // ── FUNGSI RENDER LAPANGAN ──
  const renderPitch = useCallback(() => {
    const canvas = mcRef.current; if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const dragPid = dragRef?.current?.id;
    const overTrash = dragRef?.current?.overTrash;
    const dragging = dragRef?.current?.dragging;

    ctx.clearRect(0, 0, CW, CH);
    
    // Background Lapangan
    ctx.fillStyle = '#1a5c2e'; ctx.fillRect(0,0,CW,CH);
    for(let i=0;i<6;i++){ ctx.fillStyle = i%2 ? '#1a5c2e' : '#1e6834'; ctx.fillRect(PX, PY+i*PH/6, PW, PH/6); }
    
    ctx.strokeStyle = 'rgba(255,255,255,.32)'; 
    ctx.fillStyle = 'rgba(255,255,255,.32)';
    ctx.lineWidth = 1.3; 
    
    // Garis luar
    ctx.strokeRect(PX, PY, PW, PH);
    
    // Garis tengah
    ctx.beginPath(); ctx.moveTo(PX, PY+PH/2); ctx.lineTo(PX+PW, PY+PH/2); ctx.stroke();
    
    // Lingkaran tengah & titik tengah
    ctx.beginPath(); ctx.arc(PX+PW/2, PY+PH/2, 36, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(PX+PW/2, PY+PH/2, 2, 0, Math.PI*2); ctx.fill();

    // Area penalti & area gawang (Atas)
    ctx.strokeRect(PX+PW/2 - 120, PY, 240, 80); // Kotak penalti
    ctx.strokeRect(PX+PW/2 - 50, PY, 100, 30);  // Kotak kiper
    ctx.beginPath(); ctx.arc(PX+PW/2, PY+60, 2, 0, Math.PI*2); ctx.fill(); // Titik penalti
    ctx.beginPath(); ctx.arc(PX+PW/2, PY+60, 40, Math.PI/6, Math.PI - Math.PI/6); ctx.stroke(); // Busur penalti
    
    // Area penalti & area gawang (Bawah)
    ctx.strokeRect(PX+PW/2 - 120, PY+PH - 80, 240, 80); // Kotak penalti
    ctx.strokeRect(PX+PW/2 - 50, PY+PH - 30, 100, 30);  // Kotak kiper
    ctx.beginPath(); ctx.arc(PX+PW/2, PY+PH - 60, 2, 0, Math.PI*2); ctx.fill(); // Titik penalti
    ctx.beginPath(); ctx.arc(PX+PW/2, PY+PH - 60, 40, Math.PI + Math.PI/6, Math.PI*2 - Math.PI/6); ctx.stroke(); // Busur penalti

    // Sudut lapangan (Corner arcs)
    ctx.beginPath(); ctx.arc(PX, PY, 10, 0, Math.PI/2); ctx.stroke();
    ctx.beginPath(); ctx.arc(PX+PW, PY, 10, Math.PI/2, Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(PX+PW, PY+PH, 10, Math.PI, 1.5*Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(PX, PY+PH, 10, 1.5*Math.PI, 2*Math.PI); ctx.stroke();

    // RENDER ZONA (ZBANDS)
    if (overlays.zone) {
      let lastY = 0;
      ZBANDS.forEach(b => {
        const h = b.m * PH - lastY;
        ctx.fillStyle = b.bg;
        ctx.fillRect(PX, PY + lastY, PW, h);
        ctx.fillStyle = b.tc;
        ctx.font = '600 12px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(b.l, PX + 8, PY + lastY + 16);
        lastY += h;
      });
    }

    // RENDER GARIS PASSING
    if (overlays.pass) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
          const dx = players[i].cx - players[j].cx;
          const dy = players[i].cy - players[j].cy;
          if (Math.hypot(dx, dy) < 160) { 
            ctx.moveTo(players[i].cx, players[i].cy);
            ctx.lineTo(players[j].cx, players[j].cy);
          }
        }
      }
      ctx.stroke();
    }
    
    // Enemy Shadow
    enemiesRef.current.forEach(ep => {
      ctx.beginPath(); ctx.arc(ep.cx, ep.cy, ICON_R_NORMAL, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)'; // Transparent red
      ctx.fill();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]); // Dashed line for shadow effect
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw role or position
      ctx.font = '800 11.5px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText(POS_LABEL[ep.posType] || ep.posType, ep.cx, ep.cy);
    });

    // Pemain
    [...players].sort((a,b)=>(a.id===dragPid?1:b.id===dragPid?-1:0)).forEach(p => {
      const roleId = assignedRoles[p.id];
      const isD = dragPid===p.id && dragging;
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
      ctx.font='800 11.5px monospace'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillStyle= roleId ? '#ffffff' : 'rgba(255,255,255,.7)'; ctx.fillText(POS_LABEL[p.posType] || p.posType, p.cx, p.cy);
    });
  }, [players, enemies, assignedRoles, overlays, dragRef]); // overlays sudah dimasukkan agar Zona re-render

  const { phase, triggerPhase: simTrigger, stopSim, startLoop, animRef } = useSimulation(players, setPlayers, enemies, setEnemies, assignedRoles, activeStyleId, simSpd, renderPitch, curFId, setAssignedRoles);

  // Wrapper Drag untuk mematikan animasi saat diseret
  const onDown = (mx, my) => dragDown(mx, my, () => { if (animRef.current) animRef.current.running = false; });
  const onMove = (mx, my, cx, cy) => dragMove(mx, my, cx, cy, trashRef.current?.getBoundingClientRect());
  const onUp = dragUp;

  // Render lapangan otomatis
  useEffect(() => { renderPitch(); }, [renderPitch]);

  // Render ulang coretan spidol (saat zoom atau gambar)
  useEffect(() => { redrawDrawings(drawcRef.current); }, [zoom, drawingPaths, redrawDrawings]);

  // ── FUNGSI UTAMA UI ──
  const showToast = useCallback((msg, col = '#0ea5e9') => {
    setToastData({ show: true, msg, col });
    if(toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastData(prev => ({ ...prev, show: false })), 2600);
  }, []);

  const changeFormation = (fid) => {
    stopSim(); setCurFId(fid); setAssignedRoles({}); setActiveStyleId(null);
    setPlayers(FORMATIONS[fid].players.map(p => ({ ...p, cx: gx(p.x), cy: gy(p.y) })));
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatBusy) return;
    const msg = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: msg }]);
    setChatBusy(true);

    try {
      const res = await fetch('http://localhost:8787/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatHistory, { role: 'user', content: msg }],
          tacticContext: `Formasi: ${curFId}. Role Terpasang: ${Object.values(assignedRoles).join(', ')}` 
        })
      });
      const data = await res.json();
      if (data.error) {
        showToast(data.error, '#ef4444');
      } else {
        setChatHistory(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch (err) {
      showToast('Gagal menghubungi server.', '#ef4444');
    } finally {
      setChatBusy(false);
    }
  };

  const applyStyle = (styleId) => {
    stopSim(); setCurFId(STYLE_PRESETS[styleId].formation);
    setPlayers(FORMATIONS[STYLE_PRESETS[styleId].formation].players.map(p => ({ ...p, cx: gx(p.x), cy: gy(p.y) })));
    setAssignedRoles({ ...STYLE_PRESETS[styleId].roles }); setActiveStyleId(styleId);
    setIsStyleModalOpen(false); showToast(`Gaya bermain: ${STYLE_PRESETS[styleId].name}`, '#16a34a');
  };

  const doFullReset = () => {
    stopSim(); setAssignedRoles({});
    setPlayers(FORMATIONS[curFId].players.map(p => ({ ...p, cx: gx(p.x), cy: gy(p.y) })));
    setIsResetConfirmOpen(false); showToast('Di-reset ke awal', '#16a34a');
  };

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

  return (
    <div className="app-container">
      <Header 
        curFId={curFId} changeFormation={changeFormation} activeStyleId={activeStyleId} setIsStyleModalOpen={setIsStyleModalOpen} 
        clearStyle={() => { setActiveStyleId(null); showToast('Gaya bermain dilepas', '#6b7280'); }}
        setIsSaveOpen={setIsSaveOpen} setIsLoadOpen={setIsLoadOpen} isSettingsOpen={isSettingsOpen} setIsSettingsOpen={setIsSettingsOpen}
        setIsAIChatOpen={setIsAIChatOpen} setIsBrowserOpen={setIsBrowserOpen}
      />
      <PhaseToolbar phase={phase} triggerPhase={(ph) => simTrigger(ph, gx, gy)} simSpd={simSpd} setSimSpd={setSimSpd} overlays={overlays} setOverlays={setOverlays} />
      
      <PitchCanvas 
        zoom={zoom} setZoom={setZoom} mcRef={mcRef} drawcRef={drawcRef} trashRef={trashRef}
        drawTool={drawTool} dragId={dragRef.current?.id} overTrash={dragRef.current?.overTrash}
        getScale={getScale} onDown={onDown} onMove={onMove} onUp={onUp} 
        onDrawStart={handleDrawStart} onDrawMove={handleDrawMove} onDrawEnd={handleDrawEnd}
        curFId={curFId}
      />
      
      <BottomBar 
        drawTool={drawTool} setDrawTool={setDrawTool} drawColor={drawColor} setDrawColor={setDrawColor} 
        clearDrawings={() => { clearDrawings(drawcRef.current); showToast('Coretan dihapus', '#6b7280'); }}
        isHoldingReset={isHoldingReset} startHoldReset={startHoldReset} cancelHoldReset={cancelHoldReset} resetHoldProgress={resetHoldProgress} 
      />

      <div className={`toast ${toastData.show ? 'show' : ''}`}><div className="t-dot" style={{background: toastData.col}}></div><span>{toastData.msg}</span></div>

      <AllModals 
        selectedPlayer={selectedPlayer} setSelectedPlayer={setSelectedPlayer} pendingRole={pendingRole} setPendingRole={setPendingRole} setAssignedRoles={setAssignedRoles}
        isStyleModalOpen={isStyleModalOpen} setIsStyleModalOpen={setIsStyleModalOpen} applyStyle={applyStyle} activeStyleId={activeStyleId}
        isBrowserOpen={isBrowserOpen} setIsBrowserOpen={setIsBrowserOpen}
        isSaveOpen={isSaveOpen} setIsSaveOpen={setIsSaveOpen} saveName={saveName} setSaveName={setSaveName} saveNote={saveNote} setSaveNote={setSaveNote} saveTacticToStorage={() => setIsSaveOpen(false)}
        isLoadOpen={isLoadOpen} setIsLoadOpen={setIsLoadOpen} loadTacticFromStorage={() => setIsLoadOpen(false)} deleteSaveFromStorage={() => {}}
        isAIChatOpen={isAIChatOpen} setIsAIChatOpen={setIsAIChatOpen} chatHistory={chatHistory} chatInput={chatInput} setChatInput={setChatInput} chatBusy={chatBusy} sendChatMessage={sendChatMessage}
        isResetConfirmOpen={isResetConfirmOpen} setIsResetConfirmOpen={setIsResetConfirmOpen} doFullReset={doFullReset}
      />
    </div>
  );
}