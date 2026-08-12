import React from 'react';
import { FORMATIONS, STYLE_PRESETS } from '../../data/tacticData';
const StyleModal = ({ isStyleModalOpen, setIsStyleModalOpen, applyStyle, activeStyleId }) => {
  if (!isStyleModalOpen) return null;
  return (
    <div className="overlay open" onClick={(e) => { if (e.target === e.currentTarget) setIsStyleModalOpen(false); }}>
      <div className="modal wide">
        <div className="mh">
          <div style={{ fontSize: 24 }}>🎭</div>
          <div><div className="mtitle">Preset Gaya Bermain</div><div className="msub">Otomatis isi formasi + peran</div></div>
          <button className="mclose" onClick={() => setIsStyleModalOpen(false)}>&#x2715;</button>
        </div>
        <div className="mb">
          <div className="style-grid">
            {Object.entries(STYLE_PRESETS).map(([id, style]) => (
              <button key={id} className={`style-card ${activeStyleId === id ? 'active' : ''}`} onClick={() => applyStyle(id)}>
                <div className="style-card-head"><span className="style-emoji">{style.emoji}</span><span className="style-name">{style.name}</span></div>
                <div className="style-desc">{style.desc}</div>
                <div className="ro-tags" style={{ marginTop: 7 }}>
                  <span className="ro-tag">{FORMATIONS[style.formation].name}</span>
                  <span className="ro-tag">{`lebar ×${style.modifiers.widthMult}`}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="mf"><button onClick={() => setIsStyleModalOpen(false)}>Tutup</button></div>
      </div>
    </div>
  );
};
export default StyleModal;
