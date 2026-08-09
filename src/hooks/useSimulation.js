import { useState, useRef, useCallback, useEffect } from 'react';
import { getRole, computePlayerTarget, ease } from '../utils/helpers';
import { STYLE_PRESETS, FORMATIONS } from '../data/tacticData';

export const useSimulation = (players, setPlayers, assignedRoles, activeStyleId, simSpd, renderPitch, curFId, setAssignedRoles) => {
  const [phase, setPhase] = useState(null);
  const animRef = useRef({ pAnim: {}, running: false, start: null, rafId: null });

  const startLoop = useCallback(() => {
    if (animRef.current.rafId) return;
    const loop = (time) => {
      animRef.current.rafId = null;
      let need = false;
      if (animRef.current.running) {
        if (animRef.current.start === null) animRef.current.start = time;
        const el = (time - animRef.current.start) / 1000;
        let done = true;
        const curPlayers = [...players];
        
        curPlayers.forEach(p => {
          const d = animRef.current.pAnim[p.id]; 
          if (!d) return;
          const prog = d.dr <= 0 ? 1 : Math.max(0, Math.min(1, (el - d.dl) / d.dr));
          if (prog < 1) done = false;
          const et = ease(prog, d.e);
          p.cx = d.sx + (d.tx - d.sx) * et; 
          p.cy = d.sy + (d.ty - d.sy) * et;
        });
        
        setPlayers(curPlayers);
        if (done) animRef.current.running = false; else need = true;
      }
      if (renderPitch) renderPitch();
      if (need) animRef.current.rafId = requestAnimationFrame(loop);
    };
    animRef.current.rafId = requestAnimationFrame(loop);
  }, [players, setPlayers, renderPitch]);

  const triggerPhase = useCallback((ph, gx, gy) => {
    setPhase(ph);
    const styleMod = activeStyleId ? STYLE_PRESETS[activeStyleId]?.modifiers : null;
    const pAnim = {};
    
    players.forEach(p => {
      const r = getRole(assignedRoles[p.id]);
      const t = computePlayerTarget(p, r, ph, styleMod);
      pAnim[p.id] = { 
        sx: p.cx, sy: p.cy, 
        tx: gx(t.x), ty: gy(t.y), 
        dl: t.delay / simSpd, dr: t.duration / simSpd, e: t.easing 
      };
    });
    
    animRef.current.pAnim = pAnim; 
    animRef.current.start = null; 
    animRef.current.running = true;
    startLoop();
  }, [players, assignedRoles, activeStyleId, simSpd, startLoop]);

  const stopSim = useCallback(() => { 
    animRef.current.running = false; 
    setPhase(null); 
    if(renderPitch) renderPitch(); 
  }, [renderPitch]);

  return { phase, triggerPhase, stopSim, startLoop, animRef };
};