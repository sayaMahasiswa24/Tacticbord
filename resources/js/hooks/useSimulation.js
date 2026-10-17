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

/**
 * Compute the current interpolated (x, y) position along a multi-waypoint path.
 * d.waypoints: [{ x, y, easing, ratio }]   <- canvas-normalised, ratios sum to 1
 * d.sx, d.sy: start position
 * elapsed: 0.0 → 1.0  (overall animation progress after delay)
 */
function sampleWaypointPath(d, elapsed) {
  const pts = d.waypoints; // includes start implicitly from (d.sx, d.sy)
  // Build cumulative breakpoints: [0, ratio0, ratio0+ratio1, …, 1]
  const breakpoints = [0];
  pts.forEach(wp => breakpoints.push(breakpoints[breakpoints.length - 1] + wp.ratio));

  // Find which segment we're in
  let segIdx = pts.length - 1;
  for (let i = 0; i < pts.length; i++) {
    if (elapsed <= breakpoints[i + 1]) { segIdx = i; break; }
  }

  const segStart = breakpoints[segIdx];
  const segEnd = breakpoints[segIdx + 1];
  const segProgress = segEnd > segStart ? (elapsed - segStart) / (segEnd - segStart) : 1;
  const et = ease(Math.max(0, Math.min(1, segProgress)), pts[segIdx].easing || 'ease-in-out');

  const fromX = segIdx === 0 ? d.sx : pts[segIdx - 1].x;
  const fromY = segIdx === 0 ? d.sy : pts[segIdx - 1].y;
  const toX = pts[segIdx].x;
  const toY = pts[segIdx].y;

  return {
    cx: fromX + (toX - fromX) * et,
    cy: fromY + (toY - fromY) * et,
  };
}

export const useSimulation = (players, setPlayers, enemies, setEnemies, assignedRoles, activeStyleId, simSpd, renderPitch, curFId, setAssignedRoles) => {
  const [phase, setPhase] = useState(null);
  // trajectories: { [playerId]: { waypoints: [{x,y}], startX, startY } } for drawing
  const [trajectories, setTrajectories] = useState({});
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
          const elapsed = ease(prog, d.e);

          if (d.waypoints && d.waypoints.length > 0) {
            // Multi-waypoint path — sample piecewise
            const pos = sampleWaypointPath(d, elapsed);
            p.cx = pos.cx;
            p.cy = pos.cy;
          } else {
            // Legacy single-target path
            const et = elapsed;
            p.cx = d.sx + (d.tx - d.sx) * et;
            p.cy = d.sy + (d.ty - d.sy) * et;
          }
        });

        const curEnemies = animRef.current.curEnemies || [];
        curEnemies.forEach(ep => {
          const d = animRef.current.eAnim[ep.id];
          if (!d) return;
          const prog = d.dr <= 0 ? 1 : Math.max(0, Math.min(1, (el - d.dl) / d.dr));
          if (prog < 1) done = false;
          const elapsed = ease(prog, d.e);

          if (d.waypoints && d.waypoints.length > 0) {
            const pos = sampleWaypointPath(d, elapsed);
            ep.cx = pos.cx;
            ep.cy = pos.cy;
          } else {
            ep.cx = d.sx + (d.tx - d.sx) * elapsed;
            ep.cy = d.sy + (d.ty - d.sy) * elapsed;
          }
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
    const newTrajectories = {};
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

      // Convert normalised waypoint coords to canvas pixel coords
      let canvasWaypoints = null;
      if (t.waypoints && t.waypoints.length > 0) {
        canvasWaypoints = t.waypoints.map(wp => ({
          x: gx(wp.x),
          y: gy(wp.y),
          easing: wp.easing,
          ratio: wp.ratio,
        }));
        // Always terminate at the final target (gx/gy of t.x, t.y)
        const lastWp = canvasWaypoints[canvasWaypoints.length - 1];
        if (Math.abs(lastWp.x - gx(t.x)) > 1 || Math.abs(lastWp.y - gy(t.y)) > 1) {
          canvasWaypoints.push({ x: gx(t.x), y: gy(t.y), easing: t.easing, ratio: 0.05 });
          // Re-normalise ratios
          const sum = canvasWaypoints.reduce((acc, wp) => acc + wp.ratio, 0);
          canvasWaypoints = canvasWaypoints.map(wp => ({ ...wp, ratio: wp.ratio / sum }));
        }
      }

      pAnim[p.id] = {
        sx: startX, sy: startY,
        tx: gx(t.x), ty: gy(t.y),
        dl: t.delay / simSpd, dr: t.duration / simSpd, e: t.easing,
        waypoints: canvasWaypoints,
      };
      p.cx = startX;
      p.cy = startY;

      // Record trajectory for visual overlay
      if (canvasWaypoints && canvasWaypoints.length > 0) {
        newTrajectories[p.id] = {
          startX,
          startY,
          waypoints: canvasWaypoints,
          finalX: gx(t.x),
          finalY: gy(t.y),
        };
      } else {
        newTrajectories[p.id] = {
          startX,
          startY,
          waypoints: [{ x: gx(t.x), y: gy(t.y), easing: t.easing, ratio: 1 }],
          finalX: gx(t.x),
          finalY: gy(t.y),
          simple: true,
        };
      }
    });

    enemyPlayers.forEach(ep => {
      const enemyRoleId = enemyRoles[ep.id];
      const enemyRoleObj = ROLE_MASTER.find(r => r.id === enemyRoleId);
      const dummyP = { ...ep, x: 1 - ep.x, y: 1 - ep.y, side: ep.side === 'left' ? 'right' : ep.side === 'right' ? 'left' : 'center' };
      const t = computePlayerTarget(dummyP, enemyRoleObj, enemyPhase, null);
      const prevE = enemies.find(e => e.id === ep.id);
      const startX = (phase !== null && prevE && prevE.cx !== undefined) ? prevE.cx : gx(ep.x);
      const startY = (phase !== null && prevE && prevE.cy !== undefined) ? prevE.cy : gy(1 - getKickoffY(ep.posType));

      let canvasWaypoints = null;
      if (t.waypoints && t.waypoints.length > 0) {
        canvasWaypoints = t.waypoints.map(wp => ({
          x: gx(1 - wp.x),
          y: gy(1 - wp.y),
          easing: wp.easing,
          ratio: wp.ratio,
        }));
      }

      eAnim[ep.id] = {
        sx: startX, sy: startY,
        tx: gx(1 - t.x), ty: gy(1 - t.y),
        dl: t.delay / simSpd, dr: t.duration / simSpd, e: t.easing,
        waypoints: canvasWaypoints,
      };
      ep.cx = startX;
      ep.cy = startY;
    });

    setTrajectories(newTrajectories);
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
    setTrajectories({});
    if(renderPitch) renderPitch();
  }, [renderPitch, setEnemies]);

  return { phase, triggerPhase, stopSim, startLoop, animRef, trajectories };
};