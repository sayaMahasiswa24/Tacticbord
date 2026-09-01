import { useState, useCallback, useRef } from 'react';
import { ease } from '../utils/helpers';

export const useScenario = (players, setPlayers, drawingPaths, setDrawingPaths, renderPitch) => {
  const [layers, setLayers] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLayerIndex, setCurrentLayerIndex] = useState(0);
  
  const playbackRef = useRef({ rafId: null, start: null, fromPlayers: null, toPlayers: null, fromDrawings: null, toDrawings: null });

  const recordLayer = (title = `Layer ${layers.length + 1}`) => {
    const layer = {
      id: Date.now().toString(),
      title,
      playersState: players.map(p => ({ ...p })), // clone positions
      drawings: drawingPaths ? JSON.parse(JSON.stringify(drawingPaths)) : []
    };
    setLayers(prev => [...prev, layer]);
  };

  const removeLayer = (index) => {
    setLayers(prev => prev.filter((_, i) => i !== index));
  };

  const loadLayer = (index) => {
    if (index >= 0 && index < layers.length) {
      setPlayers(layers[index].playersState.map(p => ({ ...p })));
      if (setDrawingPaths) setDrawingPaths(layers[index].drawings);
      setCurrentLayerIndex(index);
    }
  };

  const stopScenario = useCallback(() => {
    if (playbackRef.current.rafId) {
      cancelAnimationFrame(playbackRef.current.rafId);
      playbackRef.current.rafId = null;
    }
    setIsPlaying(false);
    if (renderPitch) renderPitch();
  }, [renderPitch]);

  const playTransition = (fromLayer, toLayer, durationMs, onComplete) => {
    playbackRef.current.start = null;
    playbackRef.current.fromPlayers = fromLayer.playersState;
    playbackRef.current.toPlayers = toLayer.playersState;
    if (setDrawingPaths) setDrawingPaths(toLayer.drawings); // Switch drawings immediately for now
    
    const loop = (time) => {
      if (playbackRef.current.start === null) playbackRef.current.start = time;
      const el = time - playbackRef.current.start;
      const prog = Math.max(0, Math.min(1, el / durationMs));
      const et = ease(prog, 'cubic-in-out');
      
      const newPlayers = players.map(p => {
        const fp = playbackRef.current.fromPlayers.find(x => x.id === p.id) || p;
        const tp = playbackRef.current.toPlayers.find(x => x.id === p.id) || p;
        return {
          ...p,
          cx: fp.cx + (tp.cx - fp.cx) * et,
          cy: fp.cy + (tp.cy - fp.cy) * et,
        };
      });
      
      setPlayers(newPlayers);
      if (renderPitch) renderPitch();

      if (prog < 1) {
        playbackRef.current.rafId = requestAnimationFrame(loop);
      } else {
        playbackRef.current.rafId = null;
        if (onComplete) onComplete();
      }
    };
    playbackRef.current.rafId = requestAnimationFrame(loop);
  };

  const playScenario = useCallback(() => {
    if (layers.length < 2) return;
    setIsPlaying(true);
    
    let currentIndex = 0;
    loadLayer(currentIndex);

    const playNext = () => {
      if (currentIndex >= layers.length - 1) {
        setIsPlaying(false);
        return;
      }
      
      const fromLayer = layers[currentIndex];
      const toLayer = layers[currentIndex + 1];
      
      playTransition(fromLayer, toLayer, 1000, () => {
        currentIndex++;
        setCurrentLayerIndex(currentIndex);
        setTimeout(() => {
           if (playbackRef.current.rafId !== null) return; // Means stopped
           playNext();
        }, 1000); // Wait 1 second between layers
      });
    };
    
    setTimeout(() => {
       playNext();
    }, 500); // Initial delay

  }, [layers, players, setDrawingPaths, renderPitch]);

  return {
    layers,
    setLayers,
    isPlaying,
    currentLayerIndex,
    recordLayer,
    removeLayer,
    loadLayer,
    playScenario,
    stopScenario
  };
};
