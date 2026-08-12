import { useState } from 'react';
import { FORMATIONS } from '../data/tacticData';
export const useTacticStorage = ({
  curFId, setCurFId,
  players, setPlayers,
  enemies, setEnemies,
  assignedRoles, setAssignedRoles,
  activeStyleId, setActiveStyleId,
  overlays, setOverlays,
  stopSim, showToast
}) => {
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isLoadOpen, setIsLoadOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveNote, setSaveNote] = useState('');
  const saveTacticToStorage = () => {
    if (!saveName.trim()) {
      showToast('Nama taktik tidak boleh kosong', '#ef4444');
      return;
    }
    const saves = JSON.parse(localStorage.getItem('tacticbord_v2') || '[]');
    const newSave = {
      name: saveName.trim(),
      note: saveNote.trim(),
      savedAt: Date.now(),
      formation: curFId,
      players: players.map(p => ({ id: p.id, posType: p.posType, cx: p.cx, cy: p.cy, number: p.number, x: p.x, y: p.y })),
      enemies,
      assignedRoles,
      activeStyleId,
      overlays
    };
    saves.unshift(newSave);
    localStorage.setItem('tacticbord_v2', JSON.stringify(saves));
    setIsSaveOpen(false);
    setSaveName('');
    setSaveNote('');
    showToast('Taktik berhasil disimpan', '#16a34a');
  };
  const loadTacticFromStorage = (idx) => {
    const saves = JSON.parse(localStorage.getItem('tacticbord_v2') || '[]');
    const save = saves[idx];
    if (!save) return;
    stopSim();
    const baseFormation = FORMATIONS[save.formation] || { players: [] };
    const mergedPlayers = save.players.map(sp => {
      const bp = baseFormation.players.find(p => p.id === sp.id) || {};
      return { ...bp, ...sp };
    });
    setCurFId(save.formation);
    setPlayers(mergedPlayers);
    setEnemies(save.enemies || []);
    setAssignedRoles(save.assignedRoles || {});
    setActiveStyleId(save.activeStyleId || null);
    setOverlays(save.overlays || { zone: true, pass: false });
    setIsLoadOpen(false);
    showToast('Taktik berhasil dimuat', '#16a34a');
  };
  const deleteSaveFromStorage = (e, idx) => {
    e.stopPropagation();
    const saves = JSON.parse(localStorage.getItem('tacticbord_v2') || '[]');
    saves.splice(idx, 1);
    localStorage.setItem('tacticbord_v2', JSON.stringify(saves));
    showToast('Taktik dihapus', '#6b7280');
  };
  return {
    isSaveOpen, setIsSaveOpen,
    isLoadOpen, setIsLoadOpen,
    saveName, setSaveName,
    saveNote, setSaveNote,
    saveTacticToStorage,
    loadTacticFromStorage,
    deleteSaveFromStorage
  };
};
