import React from 'react';
import { STYLE_PRESETS } from '../../data/tacticData';

const Header = ({ 
  curFId, changeFormation, activeStyleId, setIsStyleModalOpen, clearStyle, 
  setIsSaveOpen, setIsLoadOpen, isSettingsOpen, setIsSettingsOpen, 
  setIsAIChatOpen, setIsBrowserOpen, exportJSON, importJSON 
}) => {
  return (
    <header className="header">
      <div className="logo">
        <div className="logo-icon">⚽</div>
        <div>
          <div className="logo-text">TacticBord</div>
          <div className="logo-sub">On-Field Coaching Mode</div>
        </div>
      </div>
      <div className="header-mid">
        <button className="hbtn" onClick={() => setIsSaveOpen(true)}><i className="ti ti-device-floppy"></i></button>
        <button className="hbtn" onClick={() => setIsLoadOpen(true)}><i className="ti ti-folder-open"></i></button>
        <select value={curFId} onChange={(e) => changeFormation(e.target.value)} className="fsel">
          <option value="433">4-3-3</option><option value="442">4-4-2</option>
          <option value="4231">4-2-3-1</option><option value="4132">4-1-3-2 Diamond</option>
          <option value="352">3-5-2</option><option value="343">3-4-3</option>
          <option value="541">5-4-1</option>
        </select>
        <button className="hbtn style-trigger-btn" onClick={() => setIsStyleModalOpen(true)}>
          <i className="ti ti-chess-queen"></i>
          {activeStyleId ? (
            <span>{STYLE_PRESETS[activeStyleId].emoji} {STYLE_PRESETS[activeStyleId].name}</span>
          ) : (
            <span>Gaya Bermain</span>
          )}
        </button>
        {activeStyleId && (
          <button className="hbtn style-clear-btn" onClick={clearStyle} aria-label="Lepas gaya bermain" title="Lepas gaya bermain">
            <i className="ti ti-x"></i>
          </button>
        )}
      </div>
      <div className="header-right">
        <button className="hbtn settings-btn" onClick={() => setIsSettingsOpen(!isSettingsOpen)} aria-label="Menu pengaturan"><i className="ti ti-dots-vertical"></i></button>
        <div className={`settings-menu ${isSettingsOpen ? 'open' : ''}`}>
          <div className="sm-item" onClick={() => { setIsAIChatOpen(true); setIsSettingsOpen(false); }}><i className="ti ti-message-chatbot"></i>Asisten Taktik AI</div>
          <div className="sm-item" onClick={() => { setIsBrowserOpen(true); setIsSettingsOpen(false); }}><i className="ti ti-books"></i>Role Database</div>
          <div className="sm-item" onClick={() => { exportJSON(); setIsSettingsOpen(false); }}><i className="ti ti-file-export"></i>Export JSON</div>
          <label className="sm-item"><i className="ti ti-file-import"></i>Import JSON<input type="file" accept=".json" onChange={(e) => { importJSON(e); setIsSettingsOpen(false); }} /></label>
        </div>
      </div>
    </header>
  );
};

export default Header;