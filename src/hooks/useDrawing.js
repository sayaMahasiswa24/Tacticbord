import { useState, useRef } from 'react';

export const useDrawing = () => {
  const [drawTool, setDrawTool] = useState('select');
  const [drawColor, setDrawColor] = useState('#fbbf24');
  const [drawingPaths, setDrawingPaths] = useState([]);
  const drawRef = useRef({ active: false, currentPath: null });

  const clearDrawings = () => {
    setDrawingPaths([]);
    drawRef.current.currentPath = null;
    // Logika hapus canvas akan dieksekusi di komponen DrawingCanvas nantinya
  };

  return { 
    drawTool, setDrawTool, 
    drawColor, setDrawColor, 
    drawingPaths, setDrawingPaths, 
    drawRef, clearDrawings 
  };
};