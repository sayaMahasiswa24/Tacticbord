import React from 'react';
import { Link } from '@inertiajs/react';
import { STYLE_PRESETS } from '../../data/tacticData';

const Header = ({
    curFId, changeFormation, activeStyleId, setIsStyleModalOpen, clearStyle,
    isSettingsOpen, setIsSettingsOpen, setIsAIChatOpen, aiAssistantEnabled = false,
    onInstallClick, isInstalled = false, isOnline = true
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
                {/* Offline indicator if disconnected */}
                {!isOnline && (
                    <div
                        className="offline-badge"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'rgba(245, 158, 11, 0.15)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            color: '#fbbf24',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '4px 8px',
                            borderRadius: '6px'
                        }}
                        title="Mode Offline: Taktik disimpan secara lokal"
                    >
                        <i className="ti ti-wifi-off"></i>
                        <span>Offline</span>
                    </div>
                )}

                {/* PWA Install / Download Button */}
                {onInstallClick && (
                    <button
                        className="hbtn install-pwa-btn"
                        onClick={onInstallClick}
                        title={isInstalled ? "TacticBoard terpasang di perangkat" : "Unduh / Pasang TacticBoard agar bisa dibuka offline"}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: isInstalled ? 'rgba(34, 197, 94, 0.12)' : 'rgba(14, 165, 233, 0.12)',
                            border: isInstalled ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid rgba(14, 165, 233, 0.25)',
                            color: isInstalled ? '#4ade80' : '#38bdf8',
                            padding: '5px 10px',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        <i className={isInstalled ? "ti ti-device-mobile-check" : "ti ti-download"}></i>
                        <span className="install-pwa-label">{isInstalled ? "Terpasang" : "Unduh App"}</span>
                    </button>
                )}

                {aiAssistantEnabled ? (
                    <>
                        <button className="hbtn settings-btn" onClick={() => setIsSettingsOpen(!isSettingsOpen)} aria-label="Menu pengaturan">
                            <i className="ti ti-dots-vertical"></i>
                        </button>
                        <div className={`settings-menu ${isSettingsOpen ? 'open' : ''}`}>
                            <div className="sm-item" onClick={() => { setIsAIChatOpen(true); setIsSettingsOpen(false); }}>
                                <i className="ti ti-message-chatbot"></i>Asisten Taktik AI
                            </div>
                            {onInstallClick && (
                                <div className="sm-item" onClick={() => { onInstallClick(); setIsSettingsOpen(false); }}>
                                    <i className="ti ti-download"></i>{isInstalled ? "Info Aplikasi PWA" : "Pasang Aplikasi Offline"}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <button
                            className="hbtn settings-btn"
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            aria-label="Menu pengaturan"
                            title="Menu"
                        >
                            <i className="ti ti-dots-vertical"></i>
                        </button>
                        <div className={`settings-menu ${isSettingsOpen ? 'open' : ''}`}>
                            {onInstallClick && (
                                <div className="sm-item" onClick={() => { onInstallClick(); setIsSettingsOpen(false); }}>
                                    <i className="ti ti-download"></i>{isInstalled ? "Info Aplikasi PWA" : "Pasang Aplikasi Offline"}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
