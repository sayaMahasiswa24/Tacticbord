import { useState, useRef, useCallback, useEffect } from 'react';
import { getRole, computePlayerTarget, ease } from '../utils/helpers';
import { STYLE_PRESETS, FORMATIONS, ROLE_MASTER } from '../data/tacticData';
import { getAdaptiveEnemy } from '../utils/matchupEngine';
const getKickoffY = (posType) => {
  switch (posType) {
    case 'CF': return 0.52;
    case 'W':
    case 'AM': return 0.58;
    case 'CM': return 0.68;
    case 'DM': return 0.74;
    case 'FB':
    case 'WB':
    case 'CB': return 0.85;
    case 'GK': return 0.94;
    default: return 0.7;
  }
};
export const useSimulation = (players, setPlayers, enemies, setEnemies, assignedRoles, activeStyleId, simSpd, renderPitch, curFId, setAssignedRoles) => {
  const [phase, setPhase] = useState(null);
  const animRef = useRef({ pAnim: {}, eAnim: {}, running: false, start: null, rafId: null });
  const startLoop = useCallback(() => {
    if (animRef.current.rafId) return;
    const loop = (time) => {
      animRef.current.rafId = null;
      let need = false;
      if (animRef.current.running) {
        if (animRef.current.start === null) animRef.current.start = time;
        const el = (time - animRef.current.start) / 1000;
        let done = true;
        const curPlayers = animRef.current.curPlayers || [];
        curPlayers.forEach(p => {
          const d = animRef.current.pAnim[p.id]; 
          if (!d) return;
          const prog = d.dr <= 0 ? 1 : Math.max(0, Math.min(1, (el - d.dl) / d.dr));
          if (prog < 1) done = false;
          const et = ease(prog, d.e);
          p.cx = d.sx + (d.tx - d.sx) * et; 
          p.cy = d.sy + (d.ty - d.sy) * et;
        });
        const curEnemies = animRef.current.curEnemies || [];
        curEnemies.forEach(ep => {
          const d = animRef.current.eAnim[ep.id];
          if (!d) return;
          const prog = d.dr <= 0 ? 1 : Math.max(0, Math.min(1, (el - d.dl) / d.dr));
          if (prog < 1) done = false;
          const et = ease(prog, d.e);
          ep.cx = d.sx + (d.tx - d.sx) * et;
          ep.cy = d.sy + (d.ty - d.sy) * et;
        });
        setPlayers([...curPlayers]);
        setEnemies([...curEnemies]);
        if (done) animRef.current.running = false; else need = true;
      }
      if (renderPitch) renderPitch();
      if (need) animRef.current.rafId = requestAnimationFrame(loop);
    };
    animRef.current.rafId = requestAnimationFrame(loop);
  }, [players, setPlayers, enemies, setEnemies, renderPitch]);
  const triggerPhase = useCallback((ph, gx, gy) => {
    setPhase(ph);
    const styleMod = activeStyleId ? STYLE_PRESETS[activeStyleId]?.modifiers : null;
    const pAnim = {};
    const eAnim = {};
    let enemyPhase = 'defense';
    if (ph === 'defense') enemyPhase = 'possession';
    if (ph === 'transition_plus') enemyPhase = 'transition_minus';
    if (ph === 'transition_minus') enemyPhase = 'transition_plus';
    const { enemyPlayers, enemyRoles } = getAdaptiveEnemy(curFId, assignedRoles, FORMATIONS);
    players.forEach(p => {
      const r = getRole(assignedRoles[p.id]);
      const t = computePlayerTarget(p, r, ph, styleMod);
      const startX = p.cx !== undefined ? p.cx : gx(p.x);
      const startY = p.cy !== undefined ? p.cy : gy(p.y);
      pAnim[p.id] = { 
        sx: startX, sy: startY, 
        tx: gx(t.x), ty: gy(t.y), 
        dl: t.delay / simSpd, dr: t.duration / simSpd, e: t.easing 
      };
      p.cx = startX;
      p.cy = startY;
    });
    enemyPlayers.forEach(ep => {
      const enemyRoleId = enemyRoles[ep.id];
      const enemyRoleObj = ROLE_MASTER.find(r => r.id === enemyRoleId);
      const dummyP = { ...ep, x: 1 - ep.x, y: 1 - ep.y, side: ep.side === 'left' ? 'right' : ep.side === 'right' ? 'left' : 'center' }; 
      const t = computePlayerTarget(dummyP, enemyRoleObj, enemyPhase, null); 
      const prevE = enemies.find(e => e.id === ep.id);
      const startX = (phase !== null && prevE && prevE.cx !== undefined) ? prevE.cx : gx(ep.x);
      const startY = (phase !== null && prevE && prevE.cy !== undefined) ? prevE.cy : gy(1 - getKickoffY(ep.posType));
      eAnim[ep.id] = {
        sx: startX, sy: startY,
        tx: gx(1 - t.x), ty: gy(1 - t.y), 
        dl: t.delay / simSpd, dr: t.duration / simSpd, e: t.easing
      };
      ep.cx = startX;
      ep.cy = startY;
    });
    setPlayers([...players]);
    setEnemies(enemyPlayers);
    animRef.current.pAnim = pAnim; 
    animRef.current.eAnim = eAnim;
    animRef.current.curPlayers = [...players];
    animRef.current.curEnemies = enemyPlayers;
    animRef.current.start = null; 
    animRef.current.running = true;
    startLoop();
  }, [players, assignedRoles, activeStyleId, simSpd, startLoop, curFId, setPlayers, setEnemies]);
  const stopSim = useCallback(() => { 
    animRef.current.running = false; 
    setPhase(null); 
    setEnemies([]);
    if(renderPitch) renderPitch(); 
  }, [renderPitch, setEnemies]);
  return { phase, triggerPhase, stopSim, startLoop, animRef };
};