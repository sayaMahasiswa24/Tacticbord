import { useState, useEffect } from 'react';

export const useTeamRoster = () => {
  const [roster, setRoster] = useState(() => {
    try {
      const saved = localStorage.getItem('tacticbord_roster');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('tacticbord_roster', JSON.stringify(roster));
  }, [roster]);

  const addPlayer = (player) => {
    setRoster(prev => [...prev, { ...player, id: Date.now().toString() + Math.random().toString(36).substr(2, 5) }]);
  };

  const addPlayers = (newPlayers) => {
    setRoster(prev => {
      const mapped = newPlayers.map(p => ({
        ...p,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5)
      }));
      return [...prev, ...mapped];
    });
  };

  const updatePlayer = (id, updatedFields) => {
    setRoster(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deletePlayer = (id) => {
    setRoster(prev => prev.filter(p => p.id !== id));
  };

  return { roster, addPlayer, addPlayers, updatePlayer, deletePlayer };
};
