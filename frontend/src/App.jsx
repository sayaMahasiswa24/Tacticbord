import React, { useState, useRef, useCallback, useEffect, useContext } from 'react';
import './App.css';
import { FORMATIONS, TC, TB, POS_LABEL, ICON_R_NORMAL, ICON_R_DRAG, ZBANDS, STYLE_PRESETS } from './data/tacticData';
import { lighten } from './utils/helpers';
import { usePitchZoom } from './hooks/usePitchZoom';
import { useSimulation } from './hooks/useSimulation';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useDrawing } from './hooks/useDrawing';
import { useAIChat } from './hooks/useAIChat';
import { useTacticStorage } from './hooks/useTacticStorage';
import { useTeamRoster } from './hooks/useTeamRoster';
import { useScenario } from './hooks/useScenario';
import Header from './components/layout/Header';
import BottomBar from './components/layout/BottomBar';
import PitchCanvas from './components/pitch/PitchCanvas';
import AllModals from './components/modals/AllModals';

export default function App() {
  const CW = 460, CH = 580, PX = 18, PY = 14, PW = CW - PX * 2, PH = CH - PY * 2;
  const gx = useCallback((r) => PX + r * PW, [PW]);
  const gy = useCallback((r) => PY + r * PH, [PH]);
  const [isLandscape, setIsLandscape] = useState(() => window.matchMedia('(orientation: landscape)').matches);
  useEffect(() => {
    const mql = window.matchMedia('(orientation: landscape)');
    const onChange = e => setIsLandscape(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  const getPointerCoords = useCallback((clientX, clientY) => {
    const r = mcRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0, rect: { left: 0, top: 0 } };
    if (isLandscape) {
      const sx = 580 / r.width;
      const sy = 460 / r.height;
      const vx = (clientX - r.left) * sx;
      const vy = (clientY - r.top) * sy;
      return { x: 460 - vy, y: vx, rect: r };
    }
    return { x: (clientX - r.left) * (460 / r.width), y: (clientY - r.top) * (580 / r.height), rect: r };
  }, [isLandscape]);
  const mcRef = useRef(null);
  const drawcRef = useRef(null);
  const trashRef = useRef(null);
  const toastTimerRef = useRef(null);
  const resetHoldRef = useRef({ start: null, raf: null });
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
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [pendingRole, setPendingRole] = useState(null);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('tacticbord_tutorial_seen');
    if (!hasSeenTutorial) {
      setIsTutorialOpen(true);
      localStorage.setItem('tacticbord_tutorial_seen', 'true');
    }
  }, []);
  const showToast = useCallback((msg, col = '#0ea5e9') => {
    setToastData({ show: true, msg, col });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastData(prev => ({ ...prev, show: false })), 2600);
  }, []);
  const [isHoldingReset, setIsHoldingReset] = useState(false);
  const [resetHoldProgress, setResetHoldProgress] = useState(0);
  const { zoom, setZoom } = usePitchZoom(1);
  const { roster, addPlayer, updatePlayer, deletePlayer } = useTeamRoster();
  const { drawTool, setDrawTool, drawColor, setDrawColor, drawingPaths, setDrawingPaths, clearDrawings, undoDrawing, handleDrawStart, handleDrawMove, handleDrawEnd, redrawDrawings } = useDrawing();
  const scenario = useScenario(players, setPlayers, drawingPaths, setDrawingPaths, () => renderPitch());
  const { dragRef, onDown: dragDown, onMove: dragMove, onUp: dragUp } = useDragAndDrop(
    players, setPlayers, assignedRoles, setAssignedRoles, setSelectedPlayer, setPendingRole,
    () => animRef?.current?.startLoop?.(),
    () => renderPitch(),
    PX, PY, PW, PH
  );
  const renderPitch = useCallback(() => {
    const canvas = mcRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dragPid = dragRef?.current?.id;
    const overTrash = dragRef?.current?.overTrash;
    const dragging = dragRef?.current?.dragging;
    if (isLandscape) {
      ctx.clearRect(0, 0, 580, 460);
      ctx.save();
      ctx.translate(580 / 2, 460 / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.translate(-460 / 2, -580 / 2);
    } else {
      ctx.clearRect(0, 0, 460, 580);
      ctx.save();
    }
    ctx.fillStyle = '#1a5c2e'; ctx.fillRect(0, 0, CW, CH);
    for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? '#1a5c2e' : '#1e6834'; ctx.fillRect(PX, PY + i * PH / 6, PW, PH / 6); }
    ctx.strokeStyle = 'rgba(255,255,255,.32)';
    ctx.fillStyle = 'rgba(255,255,255,.32)';
    ctx.lineWidth = 1.3;
    ctx.strokeRect(PX, PY, PW, PH);
    ctx.beginPath(); ctx.moveTo(PX, PY + PH / 2); ctx.lineTo(PX + PW, PY + PH / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(PX + PW / 2, PY + PH / 2, 36, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(PX + PW / 2, PY + PH / 2, 2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeRect(PX + PW / 2 - 120, PY, 240, 80);
    ctx.strokeRect(PX + PW / 2 - 50, PY, 100, 30);
    ctx.beginPath(); ctx.arc(PX + PW / 2, PY + 60, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(PX + PW / 2, PY + 60, 40, Math.PI / 6, Math.PI - Math.PI / 6); ctx.stroke();
    ctx.strokeRect(PX + PW / 2 - 120, PY + PH - 80, 240, 80);
    ctx.strokeRect(PX + PW / 2 - 50, PY + PH - 30, 100, 30);
    ctx.beginPath(); ctx.arc(PX + PW / 2, PY + PH - 60, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(PX + PW / 2, PY + PH - 60, 40, Math.PI + Math.PI / 6, Math.PI * 2 - Math.PI / 6); ctx.stroke();
    ctx.beginPath(); ctx.arc(PX, PY, 10, 0, Math.PI / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(PX + PW, PY, 10, Math.PI / 2, Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(PX + PW, PY + PH, 10, Math.PI, 1.5 * Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(PX, PY + PH, 10, 1.5 * Math.PI, 2 * Math.PI); ctx.stroke();
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
    enemiesRef.current.forEach(ep => {
      ctx.beginPath(); ctx.arc(ep.cx, ep.cy, ICON_R_NORMAL, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '800 11.5px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText(POS_LABEL[ep.posType] || ep.posType, ep.cx, ep.cy);
    });
    [...players].sort((a, b) => (a.id === dragPid ? 1 : b.id === dragPid ? -1 : 0)).forEach(p => {
      const roleId = assignedRoles[p.id];
      const isD = dragPid === p.id && dragging;
      const col = TC[p.posType] || '#888', bdr = TB[p.posType] || '#444';
      const R = isD ? ICON_R_DRAG : ICON_R_NORMAL;
      ctx.beginPath(); ctx.arc(p.cx, p.cy, R, 0, Math.PI * 2);
      if (roleId) {
        ctx.fillStyle = overTrash && isD ? '#dc2626' : (isD ? lighten(col) : col);
        ctx.fill(); ctx.strokeStyle = bdr; ctx.lineWidth = isD ? 2.6 : 2.2; ctx.stroke();
      } else {
        ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 1.8; ctx.setLineDash([5, 3]); ctx.stroke(); ctx.setLineDash([]);
      }
      ctx.font = '800 11.5px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = roleId ? '#ffffff' : 'rgba(255,255,255,.7)'; 
      ctx.fillText(p.rosterPlayerName || POS_LABEL[p.posType] || p.posType, p.cx, p.cy);
    });
    ctx.restore();
  }, [players, enemies, assignedRoles, overlays, dragRef, isLandscape]);
  const { phase, triggerPhase: simTrigger, stopSim, startLoop, animRef } = useSimulation(players, setPlayers, enemies, setEnemies, assignedRoles, activeStyleId, simSpd, renderPitch, curFId, setAssignedRoles);
  const {
    isAIChatOpen, setIsAIChatOpen, chatHistory, setChatHistory, chatInput, setChatInput, chatBusy, sendChatMessage
  } = useAIChat(curFId, assignedRoles, showToast);
  const {
    isSaveOpen, setIsSaveOpen, isLoadOpen, setIsLoadOpen, saveName, setSaveName, saveNote, setSaveNote,
    saveTacticToStorage, loadTacticFromStorage, deleteSaveFromStorage
  } = useTacticStorage({
    curFId, setCurFId, players, setPlayers, enemies, setEnemies, assignedRoles, setAssignedRoles,
    activeStyleId, setActiveStyleId, overlays, setOverlays, stopSim, showToast, scenario
  });
  const onDown = (mx, my) => dragDown(mx, my, () => { if (animRef.current) animRef.current.running = false; });
  const onMove = (mx, my, cx, cy) => dragMove(mx, my, cx, cy, trashRef.current?.getBoundingClientRect());
  const onUp = dragUp;
  useEffect(() => { renderPitch(); }, [renderPitch]);
  useEffect(() => { redrawDrawings(drawcRef.current); }, [zoom, drawingPaths, redrawDrawings]);
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
  const startHoldReset = () => {
    setIsHoldingReset(true); resetHoldRef.current.start = Date.now();
    const tick = () => {
      const pct = Math.min(100, ((Date.now() - resetHoldRef.current.start) / 1000) * 100);
      setResetHoldProgress(pct);
      if (pct >= 100) { doFullReset(); cancelHoldReset(); return; }
      resetHoldRef.current.raf = requestAnimationFrame(tick);
    };
    resetHoldRef.current.raf = requestAnimationFrame(tick);
  };
  const cancelHoldReset = () => { setIsHoldingReset(false); setResetHoldProgress(0); if (resetHoldRef.current.raf) cancelAnimationFrame(resetHoldRef.current.raf); };
  return (
    <div className="app-container">
      <Header
        curFId={curFId} changeFormation={changeFormation} activeStyleId={activeStyleId} setIsStyleModalOpen={setIsStyleModalOpen}
        clearStyle={() => { setActiveStyleId(null); showToast('Gaya bermain dilepas', '#6b7280'); }}
        isSettingsOpen={isSettingsOpen} setIsSettingsOpen={setIsSettingsOpen}
        setIsAIChatOpen={setIsAIChatOpen}
      />
      <PitchCanvas
        zoom={zoom} mcRef={mcRef} drawcRef={drawcRef} trashRef={trashRef}
        drawTool={drawTool} dragId={dragRef.current?.id} overTrash={dragRef.current?.overTrash}
        isLandscape={isLandscape} getPointerCoords={getPointerCoords} onDown={onDown} onMove={onMove} onUp={onUp}
        onDrawStart={handleDrawStart} onDrawMove={handleDrawMove} onDrawEnd={handleDrawEnd}
        curFId={curFId}
        phase={phase} triggerPhase={(ph) => simTrigger(ph, gx, gy)} simSpd={simSpd} setSimSpd={setSimSpd}
        overlays={overlays} setOverlays={setOverlays} setZoom={setZoom}
        roster={roster} addPlayer={addPlayer} updatePlayer={updatePlayer} deletePlayer={deletePlayer}
        scenario={scenario}
        setIsBrowserOpen={setIsBrowserOpen} setIsSaveOpen={setIsSaveOpen} setIsLoadOpen={setIsLoadOpen}
      />
      <BottomBar
        drawTool={drawTool} setDrawTool={setDrawTool} drawColor={drawColor} setDrawColor={setDrawColor}
        clearDrawings={() => { clearDrawings(drawcRef.current); showToast('Coretan dihapus', '#6b7280'); }}
        undoDrawing={() => { undoDrawing(drawcRef.current); }}
        isHoldingReset={isHoldingReset} startHoldReset={startHoldReset} cancelHoldReset={cancelHoldReset} resetHoldProgress={resetHoldProgress}
      />
      <div className={`toast ${toastData.show ? 'show' : ''}`}><div className="t-dot" style={{ background: toastData.col }}></div><span>{toastData.msg}</span></div>
      <AllModals
        isTutorialOpen={isTutorialOpen} setIsTutorialOpen={setIsTutorialOpen}
        selectedPlayer={selectedPlayer} setSelectedPlayer={setSelectedPlayer} pendingRole={pendingRole} setPendingRole={setPendingRole} setAssignedRoles={setAssignedRoles}
        isStyleModalOpen={isStyleModalOpen} setIsStyleModalOpen={setIsStyleModalOpen} applyStyle={applyStyle} activeStyleId={activeStyleId}
        isBrowserOpen={isBrowserOpen} setIsBrowserOpen={setIsBrowserOpen}
        isSaveOpen={isSaveOpen} setIsSaveOpen={setIsSaveOpen} saveName={saveName} setSaveName={setSaveName} saveNote={saveNote} setSaveNote={setSaveNote} saveTacticToStorage={saveTacticToStorage}
        isLoadOpen={isLoadOpen} setIsLoadOpen={setIsLoadOpen} loadTacticFromStorage={loadTacticFromStorage} deleteSaveFromStorage={deleteSaveFromStorage}
        isAIChatOpen={isAIChatOpen} setIsAIChatOpen={setIsAIChatOpen} chatHistory={chatHistory} chatInput={chatInput} setChatInput={setChatInput} chatBusy={chatBusy} sendChatMessage={sendChatMessage}
        isResetConfirmOpen={isResetConfirmOpen} setIsResetConfirmOpen={setIsResetConfirmOpen} doFullReset={doFullReset}
        roster={roster} players={players} setPlayers={setPlayers}
      />
    </div>
  );
}