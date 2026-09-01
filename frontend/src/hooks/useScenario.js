import { useState, useCallback, useRef } from 'react';
import { ease } from '../utils/helpers';

export const useScenario = (players, setPlayers, drawingPaths, setDrawingPaths, renderPitch) => {
  const [layers, setLayers] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLayerIndex, setCurrentLayerIndex] = useState(0);
  
  const playbackRef = useRef({ rafId: null, start: null, fromPlayers: null, toPlayers: null, curPlayers: null, duration: 1000, elapsed: 0 });

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
    setIsPaused(false);
    if (renderPitch) renderPitch();
  }, [renderPitch]);

  const pauseScenario = useCallback(() => {
    if (!isPlaying) return;
    if (playbackRef.current.rafId) {
      cancelAnimationFrame(playbackRef.current.rafId);
      playbackRef.current.rafId = null;
    }
    setIsPaused(true);
  }, [isPlaying]);

  const playTransition = (fromLayer, toLayer, durationMs, initialElapsed, onComplete) => {
    playbackRef.current.start = null;
    playbackRef.current.fromPlayers = fromLayer.playersState;
    playbackRef.current.toPlayers = toLayer.playersState;
    playbackRef.current.curPlayers = [...players]; // Use current players state (shallow copy)
    playbackRef.current.duration = durationMs;
    playbackRef.current.elapsed = initialElapsed;
    
    if (setDrawingPaths) setDrawingPaths(toLayer.drawings);
    
    let lastTime = performance.now();

    const loop = (time) => {
      if (playbackRef.current.start === null) {
        playbackRef.current.start = time;
        lastTime = time;
      }
      const delta = time - lastTime;
      lastTime = time;
      playbackRef.current.elapsed += delta;
      
      const prog = Math.max(0, Math.min(1, playbackRef.current.elapsed / durationMs));
      const et = ease(prog, 'cubic-in-out');
      
      const curPlayers = playbackRef.current.curPlayers;
      curPlayers.forEach(p => {
        const fp = playbackRef.current.fromPlayers.find(x => x.id === p.id) || p;
        const tp = playbackRef.current.toPlayers.find(x => x.id === p.id) || p;
        p.cx = fp.cx + (tp.cx - fp.cx) * et;
        p.cy = fp.cy + (tp.cy - fp.cy) * et;
      });
      
      setPlayers([...curPlayers]);
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

  const resumeScenario = useCallback(() => {
    if (!isPlaying || !isPaused) return;
    setIsPaused(false);
    
    if (currentLayerIndex >= layers.length - 1) {
      setIsPlaying(false);
      return;
    }
    const fromLayer = layers[currentLayerIndex];
    const toLayer = layers[currentLayerIndex + 1];
    
    playTransition(fromLayer, toLayer, 1000, playbackRef.current.elapsed, () => {
      const nextIndex = currentLayerIndex + 1;
      setCurrentLayerIndex(nextIndex);
      if (nextIndex >= layers.length - 1) {
        setIsPlaying(false);
        setIsPaused(false);
      } else {
        setTimeout(() => {
          if (playbackRef.current.rafId !== null) return;
          playNextFrom(nextIndex);
        }, 1000);
      }
    });
  }, [isPlaying, isPaused, currentLayerIndex, layers, players, setDrawingPaths, renderPitch]);

  const playNextFrom = (index) => {
    if (index >= layers.length - 1) {
      setIsPlaying(false);
      setIsPaused(false);
      return;
    }
    setCurrentLayerIndex(index);
    const fromLayer = layers[index];
    const toLayer = layers[index + 1];
    
    playTransition(fromLayer, toLayer, 1000, 0, () => {
      const nextIndex = index + 1;
      setCurrentLayerIndex(nextIndex);
      setTimeout(() => {
         if (playbackRef.current.rafId !== null) return; // Means stopped or paused
         playNextFrom(nextIndex);
      }, 1000); // Wait 1 second between layers
    });
  };

  const playScenario = useCallback(() => {
    if (layers.length < 2) return;
    stopScenario(); // Reset any existing playback
    setIsPlaying(true);
    setIsPaused(false);
    
    loadLayer(0);
    setTimeout(() => {
       playNextFrom(0);
    }, 500); // Initial delay
  }, [layers, stopScenario]);

  const nextPhase = useCallback(() => {
    if (currentLayerIndex < layers.length - 1) {
      stopScenario();
      loadLayer(currentLayerIndex + 1);
    }
  }, [currentLayerIndex, layers, stopScenario]);

  const prevPhase = useCallback(() => {
    if (currentLayerIndex > 0) {
      stopScenario();
      loadLayer(currentLayerIndex - 1);
    }
  }, [currentLayerIndex, layers, stopScenario]);

  return {
    layers,
    setLayers,
    isPlaying,
    isPaused,
    currentLayerIndex,
    setCurrentLayerIndex,
    recordLayer,
    removeLayer,
    loadLayer,
    playScenario,
    stopScenario,
    pauseScenario,
    resumeScenario,
    nextPhase,
    prevPhase
  };
};
