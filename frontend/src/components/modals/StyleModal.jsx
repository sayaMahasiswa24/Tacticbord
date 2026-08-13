import React from 'react';
import { FORMATIONS, STYLE_PRESETS } from '../../data/tacticData';
import { STYLE_COACHES } from '../../data/examples';
const StyleModal = ({ isStyleModalOpen, setIsStyleModalOpen, applyStyle, activeStyleId }) => {
  if (!isStyleModalOpen) return null;
  return (
    <div className="overlay open" onClick={(e) => { if (e.target === e.currentTarget) setIsStyleModalOpen(false); }}>
      <div className="modal">
        <div className="mh">
          <div className="mbadge" style={{ background: '#444', fontSize: 16 }}>🎭</div>
          <div><div className="mtitle">Preset Gaya Bermain</div><div className="msub">Otomatis isi formasi + peran</div></div>
          <button className="mclose" onClick={() => setIsStyleModalOpen(false)}>&#x2715;</button>
        </div>
        <div className="mb">
          <div className="rg">
            <div className="rl">Semua Preset Gaya Bermain</div>
            {Object.entries(STYLE_PRESETS).map(([id, style]) => (
              <button key={id} className={`ro ${activeStyleId === id ? 'sel' : ''}`} onClick={() => applyStyle(id)}>
                <div className="ro-n"><span style={{ background: '#444', color: '#fff', fontSize: 10, padding: '2px 5px', borderRadius: 4, marginRight: 6 }}>{style.emoji}</span>{style.name}</div>
                <div className="ro-d">{style.desc}</div>
                <div className="ro-tags">
                  <span className="ro-tag">📋 {FORMATIONS[style.formation].name}</span>
                  <span className="ro-tag">👔 {STYLE_COACHES[id] || "-"}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="mf"><button className="ok" onClick={() => setIsStyleModalOpen(false)}>Tutup</button></div>
      </div>
    </div>
  );
};
export default StyleModal;
