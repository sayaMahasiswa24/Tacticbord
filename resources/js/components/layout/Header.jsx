import React from 'react';
import { Link } from '@inertiajs/react';
import { STYLE_PRESETS } from '../../data/tacticData';

const Header = ({
    curFId, changeFormation, activeStyleId, setIsStyleModalOpen, clearStyle,
    isSettingsOpen, setIsSettingsOpen, setIsAIChatOpen, aiAssistantEnabled = false
}) => {
    return (
        <header className="header">
            <Link href="/" className="logo" title="Kembali ke Beranda" style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src="/logo.png" alt="TacticBoard" style={{ height: '40px', objectFit: 'contain' }} />
                <div className="logo-text">TacticBoard</div>
            </Link>
            <div className="header-mid">
                <select value={curFId} onChange={(e) => changeFormation(e.target.value)} className="fsel">
                    <option value="433">4-3-3</option><option value="442">4-4-2</option>
                    <option value="4231">4-2-3-1</option><option value="4132">4-1-3-2 Diamond</option>
                    <option value="352">3-5-2</option><option value="343">3-4-3</option>
                    <option value="541">5-4-1</option>
                </select>
                <button className="hbtn style-trigger-btn" onClick={() => setIsStyleModalOpen(true)}>
                    <i className="ti ti-chess-queen"></i>
                    {activeStyleId && STYLE_PRESETS[activeStyleId] ? (
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
                {aiAssistantEnabled ? (
                    <>
                        <button className="hbtn settings-btn" onClick={() => setIsSettingsOpen(!isSettingsOpen)} aria-label="Menu pengaturan">
                            <i className="ti ti-dots-vertical"></i>
                        </button>
                        <div className={`settings-menu ${isSettingsOpen ? 'open' : ''}`}>
                            <div className="sm-item" onClick={() => { setIsAIChatOpen(true); setIsSettingsOpen(false); }}>
                                <i className="ti ti-message-chatbot"></i>Asisten Taktik AI
                            </div>
                        </div>
                    </>
                ) : (
                    <button
                        className="hbtn"
                        style={{ opacity: 0.8 }}
                        title="TacticBoard Modern Monolith (Laravel 12 + React)"
                        onClick={() => {}}
                    >
                        <i className="ti ti-device-gamepad-2"></i>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
