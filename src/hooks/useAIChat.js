import { useState } from 'react';
export const useAIChat = (curFId, assignedRoles, showToast) => {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatBusy, setChatBusy] = useState(false);
  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatBusy) return;
    const msg = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: msg }]);
    setChatBusy(true);
    try {
      const res = await fetch('http://localhost:8787/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatHistory, { role: 'user', content: msg }],
          tacticContext: `Formasi: ${curFId}. Role Terpasang: ${Object.values(assignedRoles).join(', ')}`
        })
      });
      const data = await res.json();
      if (data.error) {
        showToast(data.error, '#ef4444');
      } else {
        setChatHistory(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch (err) {
      showToast('Gagal menghubungi server.', '#ef4444');
    } finally {
      setChatBusy(false);
    }
  };
  return {
    isAIChatOpen,
    setIsAIChatOpen,
    chatHistory,
    setChatHistory,
    chatInput,
    setChatInput,
    chatBusy,
    sendChatMessage
  };
};
