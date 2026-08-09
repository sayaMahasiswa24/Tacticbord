import React, { useState, useRef, useCallback, useEffect } from 'react';
import './App.css';
import { FORMATIONS, TC, TB, POS_LABEL, ICON_R_NORMAL, ICON_R_DRAG } from './data/tacticData';
import { lighten } from './utils/helpers';
import { usePitchZoom } from './hooks/usePitchZoom';
import { useSimulation } from './hooks/useSimulation';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useDrawing } from './hooks/useDrawing';
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

  // ── FUNGSI RENDER LAPANGAN ──
  const renderPitch = useCallback(() => {
    const canvas = mcRef.current; if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const dragPid = dragRef?.current?.id;
    const overTrash = dragRef?.current?.overTrash;
    const dragging = dragRef?.current?.dragging;

    ctx.clearRect(0, 0, CW, CH);
    // Background
    ctx.fillStyle = '#1a5c2e'; ctx.fillRect(0,0,CW,CH);
    for(let i=0;i<6;i++){ ctx.fillStyle = i%2 ? '#1a5c2e' : '#1e6834'; ctx.fillRect(PX, PY+i*PH/6, PW, PH/6); }
    ctx.strokeStyle = 'rgba(255,255,255,.32)'; ctx.lineWidth = 1.3; ctx.strokeRect(PX, PY, PW, PH);
    ctx.beginPath(); ctx.moveTo(PX, PY+PH/2); ctx.lineTo(PX+PW, PY+PH/2); ctx.stroke();
    ctx.beginPath(); ctx.arc(PX+PW/2, PY+PH/2, 36, 0, Math.PI*2); ctx.stroke();
    
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
  }, [players, assignedRoles]); // Bergantung pada pemain dan peran

  // ── INIT CUSTOM HOOKS ──
  const { zoom, setZoom } = usePitchZoom(1);
  const { drawTool, setDrawTool, drawColor, setDrawColor, clearDrawings } = useDrawing();
  const { phase, triggerPhase: simTrigger, stopSim, startLoop, animRef } = useSimulation(players, setPlayers, assignedRoles, activeStyleId, simSpd, renderPitch, curFId, setAssignedRoles);
  const { dragRef, onDown: dragDown, onMove: dragMove, onUp: dragUp } = useDragAndDrop(players, setPlayers, assignedRoles, setSelectedPlayer, setPendingRole, startLoop, renderPitch, PX, PY, PW, PH);

  // Helper Wrappers untuk Drag
  const onDown = (mx, my) => dragDown(mx, my, () => { animRef.current.running = false; });
  const onMove = (mx, my, cx, cy) => dragMove(mx, my, cx, cy, trashRef.current?.getBoundingClientRect());
  const onUp = dragUp;

  // Render ulang setiap ada perubahan pemain/peran
  useEffect(() => { renderPitch(); }, [renderPitch]);

  // ── FUNGSI UTAMA ──
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

  // Reset Button Logics
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
        drawTool={drawTool} dragId={dragRef.current.id} overTrash={dragRef.current.overTrash}
        getScale={getScale} onDown={onDown} onMove={onMove} onUp={onUp} curFId={curFId}
      />
      
      <BottomBar 
        drawTool={drawTool} setDrawTool={setDrawTool} drawColor={drawColor} setDrawColor={setDrawColor} 
        clearDrawings={() => { clearDrawings(); showToast('Coretan dihapus', '#6b7280'); }}
        isHoldingReset={isHoldingReset} startHoldReset={startHoldReset} cancelHoldReset={cancelHoldReset} resetHoldProgress={resetHoldProgress} 
      />

      <div className={`toast ${toastData.show ? 'show' : ''}`}><div className="t-dot" style={{background: toastData.col}}></div><span>{toastData.msg}</span></div>

      <AllModals 
        selectedPlayer={selectedPlayer} setSelectedPlayer={setSelectedPlayer} pendingRole={pendingRole} setPendingRole={setPendingRole} setAssignedRoles={setAssignedRoles}
        isStyleModalOpen={isStyleModalOpen} setIsStyleModalOpen={setIsStyleModalOpen} applyStyle={applyStyle} activeStyleId={activeStyleId}
        isBrowserOpen={isBrowserOpen} setIsBrowserOpen={setIsBrowserOpen}
        isSaveOpen={isSaveOpen} setIsSaveOpen={setIsSaveOpen} saveName={saveName} setSaveName={setSaveName} saveNote={saveNote} setSaveNote={setSaveNote} saveTacticToStorage={() => setIsSaveOpen(false)}
        isLoadOpen={isLoadOpen} setIsLoadOpen={setIsLoadOpen} loadTacticFromStorage={() => setIsLoadOpen(false)} deleteSaveFromStorage={() => {}}
        isAIChatOpen={isAIChatOpen} setIsAIChatOpen={setIsAIChatOpen} chatHistory={chatHistory} chatInput={chatInput} setChatInput={setChatInput} chatBusy={chatBusy} 
        isResetConfirmOpen={isResetConfirmOpen} setIsResetConfirmOpen={setIsResetConfirmOpen} doFullReset={doFullReset}
      />
    </div>
  );
}