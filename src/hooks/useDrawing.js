import { useState, useRef, useCallback } from 'react';

export const useDrawing = () => {
  const [drawTool, setDrawTool] = useState('select');
  const [drawColor, setDrawColor] = useState('#fbbf24');
  const [drawingPaths, setDrawingPaths] = useState([]);
  const drawRef = useRef({ active: false, currentPath: null });

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

    paths.forEach(p => {
      if (!p || !p.points || p.points.length === 0) return;
      ctx.beginPath();
      ctx.strokeStyle = p.color || '#fbbf24';
      ctx.fillStyle = p.color || '#fbbf24';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      const start = p.points[0];
      if (p.tool === 'pen') {
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
      } else if (p.tool === 'arrow') {
        const end = p.points[p.points.length - 1];
        if (p.points.length === 1 || (start.x === end.x && start.y === end.y)) {
           ctx.arc(start.x, start.y, 1.5, 0, Math.PI * 2);
           ctx.fill();
        } else {
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
          
          // Buat kepala panah
          const angle = Math.atan2(end.y - start.y, end.x - start.x);
          ctx.beginPath();
          ctx.moveTo(end.x, end.y);
          ctx.lineTo(end.x - 15 * Math.cos(angle - Math.PI / 6), end.y - 15 * Math.sin(angle - Math.PI / 6));
          ctx.moveTo(end.x, end.y);
          ctx.lineTo(end.x - 15 * Math.cos(angle + Math.PI / 6), end.y - 15 * Math.sin(angle + Math.PI / 6));
          ctx.stroke();
        }
      }
    });
    ctx.restore();
  }, [drawingPaths]);

  const handleDrawStart = useCallback((x, y) => {
    drawRef.current.active = true;
    drawRef.current.currentPath = { tool: drawTool, color: drawColor, points: [{ x, y }] };
  }, [drawTool, drawColor]);

  const handleDrawMove = useCallback((x, y, canvas) => {
    if (!drawRef.current.active || !drawRef.current.currentPath) return;
    drawRef.current.currentPath.points.push({ x, y });
    redrawDrawings(canvas, [...drawingPaths, drawRef.current.currentPath]);
  }, [drawingPaths, redrawDrawings]);

  const handleDrawEnd = useCallback((canvas) => {
    if (!drawRef.current.active) return;
    drawRef.current.active = false;
    if (drawRef.current.currentPath) {
      setDrawingPaths(prev => [...prev, drawRef.current.currentPath]);
      drawRef.current.currentPath = null;
    }
  }, []);

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
    clearDrawings, redrawDrawings,
    handleDrawStart, handleDrawMove, handleDrawEnd
  };
};