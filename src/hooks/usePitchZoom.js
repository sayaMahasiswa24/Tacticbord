import { useState } from 'react';

export const usePitchZoom = (initialZoom = 1) => {
  const [zoom, setZoom] = useState(initialZoom);
  
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  return { zoom, setZoom, handleZoomIn, handleZoomOut, handleResetZoom };
};