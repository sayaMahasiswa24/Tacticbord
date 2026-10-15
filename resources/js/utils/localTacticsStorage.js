/**
 * Tactical Board - Local Storage & Export/Import Utilities
 * Enables zero-data-loss tactical persistence on serverless platforms (Vercel)
 */

const STORAGE_KEY = 'tacticbord_v2';

/**
 * Retrieve all tactics saved locally in the browser
 */
export const getLocalTactics = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('[localTacticsStorage] Failed to read from localStorage:', err);
    return [];
  }
};

/**
 * Save or update a tactic in localStorage
 */
export const saveLocalTactic = (tactic) => {
  if (typeof window === 'undefined') return false;
  try {
    const tactics = getLocalTactics();
    const entry = {
      ...tactic,
      id: tactic.id || `local_${Date.now()}`,
      name: tactic.title || tactic.name || 'Taktik Tanpa Judul',
      updatedAt: Date.now()
    };
    const existingIdx = tactics.findIndex(t => t.id === entry.id);
    if (existingIdx >= 0) {
      tactics[existingIdx] = entry;
    } else {
      tactics.unshift(entry);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tactics));
    return entry;
  } catch (err) {
    console.error('[localTacticsStorage] Failed to save tactic:', err);
    return false;
  }
};

/**
 * Delete a tactic from localStorage by index or id
 */
export const deleteLocalTactic = (identifier) => {
  if (typeof window === 'undefined') return false;
  try {
    const tactics = getLocalTactics();
    const updated = typeof identifier === 'number'
      ? tactics.filter((_, idx) => idx !== identifier)
      : tactics.filter(t => t.id !== identifier);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('[localTacticsStorage] Failed to delete tactic:', err);
    return false;
  }
};

/**
 * Export a tactical setup as a downloadable JSON file
 */
export const exportTacticJSON = (tactic, filename = 'tactic.json') => {
  if (typeof window === 'undefined') return;
  const jsonStr = JSON.stringify(tactic, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (tactic.title || tactic.name || 'football_tactic').replace(/\s+/g, '_') + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Parse an imported JSON file into a valid tactic object
 */
export const importTacticJSON = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'));
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.formation && !parsed.players) {
          throw new Error('Invalid tactical file structure');
        }
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Share a tactic via Web Share API or copy shareable link to clipboard
 */
export const shareTactic = async (tactic) => {
  if (typeof window === 'undefined') return false;
  const shareData = {
    title: tactic.title || tactic.name || 'Football Tactical Board',
    text: `Papan Taktik Sepak Bola: ${tactic.title || tactic.name} (Formasi: ${tactic.formation})`,
    url: window.location.href
  };

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { shared: true, method: 'native' };
    } catch (err) {
      if (err.name !== 'AbortError') console.warn('Web Share failed:', err);
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(window.location.href);
    return { shared: true, method: 'clipboard' };
  } catch {
    return { shared: false };
  }
};
