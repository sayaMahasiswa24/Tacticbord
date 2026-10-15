import { useRef } from 'react';
import { HIT_RADIUS } from '../data/tacticData';
import { detectPosType } from '../utils/helpers';

export const useDragAndDrop = (players, setPlayers, assignedRoles, setAssignedRoles, setSelectedPlayer, setPendingRole, startLoop, renderPitch, PX, PY, PW, PH) => {
  const dragRef = useRef({ id: null, dOX: 0, dOY: 0, dragging: false, moved: false, overTrash: false, hoverId: null });

  const onDown = (mx, my, animRunningFalse) => {
    const h = players.slice().reverse().find(p => Math.hypot(p.cx - mx, p.cy - my) < HIT_RADIUS);
    if (!h) return false;
    if (animRunningFalse) animRunningFalse();
    dragRef.current = { id: h.id, dOX: mx - h.cx, dOY: my - h.cy, dragging: false, moved: false, overTrash: false, hoverId: dragRef.current.hoverId };
    return true;
  };

  const onMove = (mx, my, clientX, clientY, trashRect) => {
    const { id: dragPid, dOX, dOY } = dragRef.current;
    if (dragPid !== null) {
      const curPlayers = [...players];
      const p = curPlayers.find(x => x.id === dragPid);
      if (p) {
        p.cx = Math.max(PX + 13, Math.min(PX + PW - 13, mx - dOX)); 
        p.cy = Math.max(PY + 13, Math.min(PY + PH - 13, my - dOY));
        dragRef.current.dragging = true; 
        dragRef.current.moved = true;
        if (clientX !== undefined && trashRect) {
          dragRef.current.overTrash = clientX >= trashRect.left && clientX <= trashRect.right && clientY >= trashRect.top && clientY <= trashRect.bottom;
        }
      }
      setPlayers(curPlayers);
      if (startLoop) startLoop();
    }
  };

  const onUp = () => {
    const { id: dragPid, moved, overTrash } = dragRef.current;
    if (dragPid !== null) {
      const curPlayers = [...players];
      const pIndex = curPlayers.findIndex(x => x.id === dragPid);
      const p = curPlayers[pIndex];
      if (!moved && !overTrash && p) { 
        setSelectedPlayer(p); 
        setPendingRole(assignedRoles[p.id] || null); 
      } else if (moved && !overTrash && p) {
        // Only auto-detect new position if no role/player is assigned to this pawn.
        // This ensures the role and position type stay locked when the user drags an assigned pawn.
        if (!assignedRoles[p.id] && !p.rosterPlayerId) {
          const rx = (p.cx - PX) / PW;
          const ry = (p.cy - PY) / PH;
          const newPos = detectPosType(rx, ry, p.posType);
          if (newPos.posType !== p.posType || newPos.side !== p.side) {
            p.posType = newPos.posType;
            p.side = newPos.side;
            setPlayers(curPlayers);
          }
        }
      }
      dragRef.current = { id: null, dOX: 0, dOY: 0, dragging: false, moved: false, overTrash: false, hoverId: null };
      if (renderPitch) renderPitch();
    }
  };

  return { dragRef, onDown, onMove, onUp };
};