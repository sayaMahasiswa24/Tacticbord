import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { FORMATIONS } from '../data/tacticData';

const DEFAULT_SERVER_TACTICS = [];

export const useTacticStorage = ({
  curFId, setCurFId,
  players, setPlayers,
  enemies, setEnemies,
  assignedRoles, setAssignedRoles,
  activeStyleId, setActiveStyleId,
  overlays, setOverlays,
  stopSim, showToast, scenario,
  serverTactics = DEFAULT_SERVER_TACTICS
}) => {
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isLoadOpen, setIsLoadOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveNote, setSaveNote] = useState('');
  const [allSaves, setAllSaves] = useState(serverTactics || []);
  const lastTacticsKeyRef = useRef(null);

  // Merge server tactics and local storage tactics without infinite re-render loops
  useEffect(() => {
    const serialized = JSON.stringify(serverTactics || []);
    if (lastTacticsKeyRef.current === serialized) {
      return;
    }
    lastTacticsKeyRef.current = serialized;

    try {
      const localSaves = JSON.parse(localStorage.getItem('tacticbord_v2') || '[]');
      const serverMap = new Set((serverTactics || []).map(s => s.id));
      const combined = [
        ...(serverTactics || []),
        ...localSaves.filter(s => !s.id || !serverMap.has(s.id))
      ];
      setAllSaves(combined);
    } catch {
      setAllSaves(serverTactics || []);
    }
  }, [serverTactics]);

  const saveTacticToStorage = () => {
    if (!saveName.trim()) {
      showToast('Nama taktik tidak boleh kosong', '#ef4444');
      return;
    }

    const payload = {
      title: saveName.trim(),
      note: saveNote.trim(),
      formation: curFId,
      players: players.map(p => ({ id: p.id, posType: p.posType, cx: p.cx, cy: p.cy, number: p.number, x: p.x, y: p.y })),
      enemies,
      assignedRoles,
      activeStyleId,
      overlays,
      scenarioLayers: scenario ? scenario.layers : []
    };

    // Save locally for offline fallback
    try {
      const localSaves = JSON.parse(localStorage.getItem('tacticbord_v2') || '[]');
      localSaves.unshift({
        ...payload,
        name: payload.title,
        savedAt: Date.now()
      });
      localStorage.setItem('tacticbord_v2', JSON.stringify(localSaves));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    // Persist to Laravel SQLite via Inertia router
    try {
      router.post('/tactics', payload, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          setIsSaveOpen(false);
          setSaveName('');
          setSaveNote('');
          showToast('Taktik berhasil disimpan ke SQLite', '#16a34a');
        },
        onError: () => {
          setIsSaveOpen(false);
          setSaveName('');
          setSaveNote('');
          showToast('Taktik tersimpan (mode offline)', '#f59e0b');
        }
      });
    } catch {
      setIsSaveOpen(false);
      setSaveName('');
      setSaveNote('');
      showToast('Taktik tersimpan lokal', '#16a34a');
    }
  };

  const loadTacticFromStorage = (idx) => {
    const save = allSaves[idx];
    if (!save) return;
    stopSim();

    const baseFormation = FORMATIONS[save.formation] || { players: [] };
    const savedPlayers = save.players || [];
    const mergedPlayers = savedPlayers.map(sp => {
      const bp = baseFormation.players.find(p => p.id === sp.id) || {};
      return { ...bp, ...sp };
    });

    setCurFId(save.formation);
    setPlayers(mergedPlayers.length > 0 ? mergedPlayers : baseFormation.players.map(p => ({ ...p, cx: p.x, cy: p.y })));
    setEnemies(save.enemies || []);
    setAssignedRoles(save.assignedRoles || {});
    setActiveStyleId(save.activeStyleId || null);
    setOverlays(save.overlays || { zone: true, pass: false });

    if (scenario && save.scenarioLayers) {
      scenario.setLayers(save.scenarioLayers);
      scenario.setCurrentLayerIndex(save.scenarioLayers.length > 0 ? save.scenarioLayers.length - 1 : 0);
    } else if (scenario) {
      scenario.setLayers([]);
      scenario.setCurrentLayerIndex(0);
    }

    setIsLoadOpen(false);
    showToast(`Taktik "${save.name || save.title}" dimuat`, '#16a34a');
  };

  const deleteSaveFromStorage = (e, idx) => {
    e.stopPropagation();
    const save = allSaves[idx];
    if (!save) return;

    if (save.id) {
      try {
        router.delete(`/tactics/${save.id}`, {
          preserveScroll: true,
          preserveState: true,
          onSuccess: () => showToast('Taktik dihapus dari database', '#6b7280'),
          onError: () => showToast('Gagal menghapus dari database', '#ef4444')
        });
      } catch (err) {
        console.error(err);
      }
    }

    // Also remove from local storage
    try {
      const localSaves = JSON.parse(localStorage.getItem('tacticbord_v2') || '[]');
      const updated = localSaves.filter((_, i) => i !== idx);
      localStorage.setItem('tacticbord_v2', JSON.stringify(updated));
    } catch {}

    setAllSaves(prev => prev.filter((_, i) => i !== idx));
    showToast('Taktik dihapus', '#6b7280');
  };

  return {
    isSaveOpen, setIsSaveOpen,
    isLoadOpen, setIsLoadOpen,
    saveName, setSaveName,
    saveNote, setSaveNote,
    allSaves,
    saveTacticToStorage,
    loadTacticFromStorage,
    deleteSaveFromStorage
  };
};
