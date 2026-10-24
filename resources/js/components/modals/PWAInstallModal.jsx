import React from 'react';

export default function PWAInstallModal({
    isOpen,
    onClose,
    isInstalled,
    isIOS,
    isInstallable,
    onInstall
}) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
            <div
                className="modal-box pwa-modal-box"
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: '460px',
                    width: '90%',
                    background: '#111827',
                    border: '1px solid rgba(14, 165, 233, 0.3)',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(14, 165, 233, 0.15)',
                    color: '#f8fafc',
                    position: 'relative'
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        fontSize: '20px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '8px'
                    }}
                    title="Tutup"
                >
                    ✕
                </button>

                {/* Header with App Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                    <img
                        src="/logo.png"
                        alt="TacticBoard"
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                        }}
                    />
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
                            Pasang TacticBoard
                        </h3>
                        <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 500 }}>
                            Aplikasi Offline (Progressive Web App)
                        </span>
                    </div>
                </div>

                {/* Body Content */}
                {isInstalled ? (
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🎉</div>
                        <h4 style={{ margin: '0 0 8px 0', color: '#22c55e', fontSize: '1.1rem' }}>
                            Aplikasi Sudah Terpasang!
                        </h4>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
                            TacticBoard sudah terpasang di perangkat Anda. Anda dapat membukanya kapan saja langsung dari Desktop Windows / Layar Utama HP secara offline tanpa kuota internet.
                        </p>
                    </div>
                ) : (
                    <div>
                        <p style={{ margin: '0 0 16px 0', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.5 }}>
                            Unduh dan pasang TacticBoard ke perangkat Anda untuk akses instan layar penuh dan kemampuan merancang taktik secara <strong>100% offline</strong>.
                        </p>

                        {/* Direct Install Button if Browser Supports it */}
                        {isInstallable && (
                            <button
                                onClick={async () => {
                                    await onInstall();
                                }}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '12px 20px',
                                    borderRadius: '10px',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)',
                                    marginBottom: '20px',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                            >
                                <i className="ti ti-download" style={{ fontSize: '1.2rem' }}></i>
                                Pasang Sekarang ke Perangkat
                            </button>
                        )}

                        {/* Guide Steps */}
                        <div style={{
                            background: 'rgba(30, 41, 59, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '12px',
                            padding: '14px 16px',
                            fontSize: '0.85rem'
                        }}>
                            <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '10px' }}>
                                {isIOS ? '📱 Panduan Pasang di iPhone / iPad (Safari):' : '💻 Panduan Pasang di Browser / Desktop:'}
                            </div>

                            {isIOS ? (
                                <ol style={{ margin: 0, paddingLeft: '20px', color: '#94a3b8', lineHeight: 1.6 }}>
                                    <li>Tekan tombol <strong>Share / Bagikan</strong> (<i className="ti ti-share"></i>) di bilah bawah Safari.</li>
                                    <li>Gulir ke bawah, lalu pilih <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong>.</li>
                                    <li>Tekan <strong>Tambah</strong> di pojok kanan atas. Icon TacticBoard akan langsung muncul di HP Anda!</li>
                                </ol>
                            ) : (
                                <ol style={{ margin: 0, paddingLeft: '20px', color: '#94a3b8', lineHeight: 1.6 }}>
                                    <li>Klik tombol <strong>Pasang Sekarang</strong> di atas, atau:</li>
                                    <li>Lihat ikon <strong>Install / Pasang</strong> (<i className="ti ti-download"></i> atau ➕) di sudut kanan bilah alamat URL browser (Chrome/Edge).</li>
                                    <li>Atau klik menu browser (titik tiga <strong>⋮</strong>) &rarr; pilih <strong>"Pasang TacticBoard..."</strong>.</li>
                                    <li>Aplikasi akan langsung terpasang di komputer/laptop Anda dan bisa dibuka kapan saja tanpa koneksi internet.</li>
                                </ol>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer Notes */}
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#94a3b8',
                            padding: '8px 20px',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                        }}
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
