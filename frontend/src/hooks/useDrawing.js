import { useState, useRef, useCallback } from 'react';

export const useDrawing = () => {
  const [drawTool, setDrawTool] = useState('select');
  const [drawColor, setDrawColor] = useState('#fbbf24');
  const [drawingPaths, setDrawingPaths] = useState([]);
  const drawRef = useRef({ active: false, currentPath: null });

  /* ── helper: draw a single path onto a 2D context ── */
  const renderPath = (ctx, p) => {
    if (!p || !p.points || p.points.length === 0) return;

    ctx.strokeStyle = p.color || '#fbbf24';
    ctx.fillStyle   = p.color || '#fbbf24';
    ctx.lineWidth   = p.lineWidth || 3;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.setLineDash([]);

    const start = p.points[0];

    switch (p.tool) {
      /* ── free-hand pen ── */
      case 'pen': {
        ctx.beginPath();
        if (p.points.length === 1) {
          ctx.arc(start.x, start.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.moveTo(start.x, start.y);
          for (let i = 1; i < p.points.length; i++) {
            ctx.lineTo(p.points[i].x, p.points[i].y);
          }
          ctx.stroke();
        }
        break;
      }

      /* ── straight arrow ── */
      case 'arrow': {
        const end = p.points[p.points.length - 1];
        if (p.points.length === 1 || (start.x === end.x && start.y === end.y)) {
          ctx.beginPath();
          ctx.arc(start.x, start.y, 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // shaft
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();

          // arrowhead
          const angle = Math.atan2(end.y - start.y, end.x - start.x);
          const headLen = 14;
          ctx.beginPath();
          ctx.moveTo(end.x, end.y);
          ctx.lineTo(
            end.x - headLen * Math.cos(angle - Math.PI / 6),
            end.y - headLen * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            end.x - headLen * Math.cos(angle + Math.PI / 6),
            end.y - headLen * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();
        }
        break;
      }

      /* ── dashed line ── */
      case 'dash': {
        const end = p.points[p.points.length - 1];
        if (p.points.length === 1 || (start.x === end.x && start.y === end.y)) {
          ctx.beginPath();
          ctx.arc(start.x, start.y, 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.setLineDash([10, 6]);
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
          ctx.setLineDash([]);

          // small arrowhead
          const angle = Math.atan2(end.y - start.y, end.x - start.x);
          const headLen = 10;
          ctx.beginPath();
          ctx.moveTo(end.x, end.y);
          ctx.lineTo(
            end.x - headLen * Math.cos(angle - Math.PI / 6),
            end.y - headLen * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            end.x - headLen * Math.cos(angle + Math.PI / 6),
            end.y - headLen * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();
        }
        break;
      }

      /* ── curved arrow (quadratic bezier) ── */
      case 'curve': {
        const end = p.points[p.points.length - 1];
        if (p.points.length === 1 || (start.x === end.x && start.y === end.y)) {
          ctx.beginPath();
          ctx.arc(start.x, start.y, 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // compute control point (perpendicular offset)
          const mx = (start.x + end.x) / 2;
          const my = (start.y + end.y) / 2;
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const dist = Math.hypot(dx, dy);
          const curveAmount = Math.min(dist * 0.35, 60);
          // perpendicular direction
          const nx = -dy / dist;
          const ny = dx / dist;
          const cpx = mx + nx * curveAmount;
          const cpy = my + ny * curveAmount;

          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.quadraticCurveTo(cpx, cpy, end.x, end.y);
          ctx.stroke();

          // arrowhead at the end, tangent to the curve at t=1
          // tangent at t=1 of quadratic bezier: 2*(P2-CP) 
          const tx = end.x - cpx;
          const ty = end.y - cpy;
          const angle = Math.atan2(ty, tx);
          const headLen = 12;
          ctx.beginPath();
          ctx.moveTo(end.x, end.y);
          ctx.lineTo(
            end.x - headLen * Math.cos(angle - Math.PI / 6),
            end.y - headLen * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            end.x - headLen * Math.cos(angle + Math.PI / 6),
            end.y - headLen * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();
        }
        break;
      }

      /* ── straight line (no arrowhead) ── */
      case 'line': {
        const end = p.points[p.points.length - 1];
        if (p.points.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        }
        break;
      }

      default:
        break;
    }
  };

  /* ── redraw all saved paths + optional live path ── */
  const redrawDrawings = useCallback((canvas, paths = drawingPaths) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isLandscape = canvas.width > canvas.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    if (isLandscape) {
      ctx.translate(580 / 2, 460 / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.translate(-460 / 2, -580 / 2);
    }

    paths.forEach(p => renderPath(ctx, p));

    ctx.restore();
  }, [drawingPaths]);

  /* ── pointer handlers ── */
  const handleDrawStart = useCallback((x, y) => {
    if (drawTool === 'select') return;
    drawRef.current.active = true;
    drawRef.current.currentPath = {
      tool: drawTool,
      color: drawColor,
      points: [{ x, y }]
    };
  }, [drawTool, drawColor]);

  const handleDrawMove = useCallback((x, y, canvas) => {
    if (!drawRef.current.active || !drawRef.current.currentPath) return;

    const tool = drawRef.current.currentPath.tool;

    if (tool === 'pen') {
      // freehand: accumulate all points
      drawRef.current.currentPath.points.push({ x, y });
    } else {
      // arrow / dash / curve / line: only track start + current end
      drawRef.current.currentPath.points = [
        drawRef.current.currentPath.points[0],
        { x, y }
      ];
    }

    // live preview: existing paths + current in-progress path
    redrawDrawings(canvas, [...drawingPaths, drawRef.current.currentPath]);
  }, [drawingPaths, redrawDrawings]);

  const handleDrawEnd = useCallback((canvas) => {
    if (!drawRef.current.active) return;
    drawRef.current.active = false;

    if (drawRef.current.currentPath && drawRef.current.currentPath.points.length >= 1) {
      const finishedPath = { ...drawRef.current.currentPath };
      setDrawingPaths(prev => [...prev, finishedPath]);
      drawRef.current.currentPath = null;
    }
  }, []);

  /* ── undo last drawing ── */
  const undoDrawing = useCallback((canvas) => {
    setDrawingPaths(prev => {
      const next = prev.slice(0, -1);
      // immediate visual update
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const isLandscape = canvas.width > canvas.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        if (isLandscape) {
          ctx.translate(580 / 2, 460 / 2);
          ctx.rotate(-Math.PI / 2);
          ctx.translate(-460 / 2, -580 / 2);
        }
        next.forEach(p => renderPath(ctx, p));
        ctx.restore();
      }
      return next;
    });
  }, []);

  /* ── clear all drawings ── */
  const clearDrawings = useCallback((canvas) => {
    setDrawingPaths([]);
    drawRef.current.currentPath = null;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  return {
    drawTool, setDrawTool,
    drawColor, setDrawColor,
    drawingPaths, setDrawingPaths,
    clearDrawings, undoDrawing, redrawDrawings,
    handleDrawStart, handleDrawMove, handleDrawEnd
  };
};