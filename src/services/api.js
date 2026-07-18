// File: src/services/api.js

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8787';

// Fungsi Chat AI
export async function sendChatMessage(messages, tacticContext) {
  const res = await fetch(`${BACKEND_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      tacticContext,
      sessionId: crypto.randomUUID(),
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.reply;
}

// [KODE OPSIONAL] Mengambil daftar role bola dari database
export async function fetchRoles(posType) {
  const url = posType
    ? `${BACKEND_URL}/api/roles?posType=${posType}`
    : `${BACKEND_URL}/api/roles`;
  const res = await fetch(url);
  return res.json();
}

// [KODE OPSIONAL] Menyimpan taktik ke database backend
export async function saveTacticToServer(tactic) {
  const res = await fetch(`${BACKEND_URL}/api/tactics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tactic),
  });
  return res.json();
}