import React from 'react';

const AIChatModal = ({ isAIChatOpen, setIsAIChatOpen, chatHistory, chatInput, setChatInput, chatBusy, sendChatMessage }) => {
  if (!isAIChatOpen) return null;

  return (
    <div className="overlay open" onClick={(e) => { if (e.target === e.currentTarget) setIsAIChatOpen(false); }}>
      <div className="modal chat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mh">
          <div style={{ fontSize: 22 }}>🤖</div>
          <div><div className="mtitle">Asisten Taktik AI</div><div className="msub">Bertanya soal saran & solusi taktis</div></div>
          <button className="mclose" onClick={() => setIsAIChatOpen(false)}>&#x2715;</button>
        </div>
        <div className="chat-log">
          {chatHistory.length === 0 && <div className="chat-empty">💡 Tanyakan apa saja soal taktik sepak bola! (Asisten ini dikonfigurasi khusus untuk membahas sepak bola saja)</div>}
          {chatHistory.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role === 'user' ? 'user' : 'ai'}`}>
              {m.role === 'user' ? m.content : <span dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, '<br>') }} />}
            </div>
          ))}
          {chatBusy && <div className="chat-loading"><div className="chat-spinner"></div><span>Menganalisis...</span></div>}
        </div>
        <div className="chat-input-row">
          <textarea rows={1} value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Tulis pertanyaan taktikmu..." onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }} />
          <button className="chat-send-btn" disabled={chatBusy} onClick={() => sendChatMessage()}><i className="ti ti-send"></i></button>
        </div>
      </div>
    </div>
  );
};

export default AIChatModal;
