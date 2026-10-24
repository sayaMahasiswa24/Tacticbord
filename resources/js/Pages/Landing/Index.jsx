import React from 'react';
import { Head, Link } from '@inertiajs/react';
import mockupShowcase from '@/assets/mockup-showcase.png';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import PWAInstallModal from '@/components/modals/PWAInstallModal';

export default function LandingIndex() {
    const { isInstallable, isInstalled, isIOS, showInstallGuide, setShowInstallGuide, promptInstall } = usePWAInstall();
    return (
        <div className="landing-wrapper">
            <Head title="Think Tactics. Build Your Game. - Papan Taktik Sepak Bola Modern" />

            {/* ── HEADER / NAVIGATION ── */}
            <header className="landing-nav">
                <div className="landing-nav-inner">
                    <Link href="/" className="landing-brand">
                        <img src="/logo.png" alt="TacticBoard" className="landing-brand-logo" />
                        <span className="landing-brand-name">TacticBoard</span>
                    </Link>

                    <nav className="landing-menu" aria-label="Main Navigation">
                        <a href="#features" className="landing-menu-link">Features</a>
                        <a href="#how-it-works" className="landing-menu-link">How it works</a>
                        <a href="#for-coaches" className="landing-menu-link">For coaches</a>
                        <a href="#about" className="landing-menu-link">buy app</a>
                    </nav>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                            onClick={promptInstall}
                            className="landing-btn-install-nav"
                            id="btn-install-app-nav"
                            title="Unduh / Pasang TacticBoard agar bisa dibuka offline"
                        >
                            <i className={isInstalled ? "ti ti-device-mobile-check" : "ti ti-download"}></i>
                            <span>{isInstalled ? "Aplikasi Terpasang" : "Unduh / Install App"}</span>
                        </button>

                        <Link href="/board" className="landing-btn-primary" id="btn-open-trial-top">
                            Open trial tactical board
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── HERO SECTION ── */}
            <section className="landing-hero" id="hero">
                <div className="landing-hero-content">
                    <div className="landing-pill-tag">
                        <span>TACTICAL PLAYMAKER • BUILT FOR THE GAME</span>
                    </div>

                    <h1 className="landing-hero-title">
                        Think Tactics.<br />
                        Build Your Game.
                    </h1>

                    <p className="landing-hero-desc">
                        Design smarter football strategies, map player movement, and turn match ideas into
                        clear tactical plans — all in one focused workspace.
                    </p>

                    <div className="landing-hero-cta">
                        <Link href="/board" className="landing-hero-btn-primary" id="btn-start-building">
                            <span>Start building tactics</span>
                            <span style={{ fontSize: '18px' }}>↗</span>
                        </Link>

                        <button
                            onClick={promptInstall}
                            className="landing-hero-btn-install"
                            id="btn-install-hero"
                        >
                            <i className={isInstalled ? "ti ti-device-mobile-check" : "ti ti-download"}></i>
                            <span>{isInstalled ? "Aplikasi Sudah Terpasang" : "Unduh / Pasang Offline"}</span>
                        </button>

                        <a href="#features" className="landing-hero-btn-secondary" id="btn-explore-workspace">
                            <span>Explore the workspace</span>
                        </a>
                    </div>

                    <div className="landing-hero-badges">
                        <div className="landing-badge-pill">
                            <span style={{ color: '#22c55e' }}>✦</span>
                            <span>Drag-and-drop tactics</span>
                        </div>
                        <div className="landing-badge-pill">
                            <span style={{ color: '#22c55e' }}>↗</span>
                            <span>Shareable scenarios</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── AUDIENCE BAR ── */}
            <section className="landing-audience-bar" id="for-coaches">
                <div className="landing-container">
                    <ul className="landing-audience-list">
                        <li className="landing-audience-item">Club Coaches</li>
                        <li className="landing-audience-divider" aria-hidden="true"></li>
                        <li className="landing-audience-item">Match Analysts</li>
                        <li className="landing-audience-divider" aria-hidden="true"></li>
                        <li className="landing-audience-item">Football Academies</li>
                        <li className="landing-audience-divider" aria-hidden="true"></li>
                        <li className="landing-audience-item">Players & Teams</li>
                    </ul>
                </div>
            </section>

            {/* ── FEATURES SECTION ── */}
            <section className="landing-features-section" id="features">
                <div className="landing-container">
                    <div className="landing-section-header">
                        <h2 className="landing-section-title">
                            Everything you need to<br />
                            see the game differently.
                        </h2>
                        <p className="landing-section-desc">
                            A tactical workspace that keeps your ideas structured, visual, and ready to communicate.
                        </p>
                    </div>

                    <div className="landing-features-grid">
                        {/* Feature 1 */}
                        <div className="landing-feature-card">
                            <div className="landing-feature-top">
                                <span className="landing-feature-icon">↗</span>
                                <span className="landing-feature-tag">01 / FEATURE</span>
                            </div>
                            <h3 className="landing-feature-title">Visual tactics board</h3>
                            <p className="landing-feature-desc">
                                Move players, map passing lanes, and sketch attacking patterns on a clean pitch canvas.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="landing-feature-card">
                            <div className="landing-feature-top">
                                <span className="landing-feature-icon">⌘</span>
                                <span className="landing-feature-tag">02 / FEATURE</span>
                            </div>
                            <h3 className="landing-feature-title">Phases & formations</h3>
                            <p className="landing-feature-desc">
                                Switch between build-up, attack, transition, and defensive shapes without losing context.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="landing-feature-card">
                            <div className="landing-feature-top">
                                <span className="landing-feature-icon">🗂️</span>
                                <span className="landing-feature-tag">03 / FEATURE</span>
                            </div>
                            <h3 className="landing-feature-title">Scenario library</h3>
                            <p className="landing-feature-desc">
                                Organize match plans, create alternatives, and keep every tactical idea easy to revisit.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="landing-feature-card">
                            <div className="landing-feature-top">
                                <span className="landing-feature-icon">🎯</span>
                                <span className="landing-feature-tag">04 / FEATURE</span>
                            </div>
                            <h3 className="landing-feature-title">Coach-ready sharing</h3>
                            <p className="landing-feature-desc">
                                Make complex movements easier to explain with clear visual language and annotations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SHOWCASE SECTION ── */}
            <section className="landing-showcase-section" id="showcase">
                <div className="landing-container">
                    <div className="landing-section-header">
                        <h2 className="landing-section-title">
                            Your game plan,<br />
                            at a glance.
                        </h2>
                        <p className="landing-section-desc">
                            A focused canvas for the details that make the difference — shape, spacing, movement, and intent.
                        </p>
                    </div>

                    <div className="landing-mockup-wrapper">
                        <Link href="/board" title="Klik untuk membuka papan taktik interaktif">
                            <img
                                src={mockupShowcase}
                                alt="Showcase"
                                className="landing-mockup-img"
                                loading="lazy"
                            />
                        </Link>
                        <Link href="/board" className="landing-mockup-overlay-badge">
                            <span>Buka Kanvas Taktik</span>
                            <span>↗</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS (3 STEPS) ── */}
            <section className="landing-steps-section" id="how-it-works">
                <div className="landing-container">
                    <div className="landing-section-header">
                        <h2 className="landing-section-title">
                            From idea to match day<br />
                            in three simple steps.
                        </h2>
                    </div>

                    <div className="landing-steps-grid">
                        <div className="landing-step-card">
                            <div className="landing-step-num">01</div>
                            <h3 className="landing-step-title">Set your shape</h3>
                            <p className="landing-step-desc">
                                Choose a formation and place your players where the plan starts.
                            </p>
                        </div>

                        <div className="landing-step-card">
                            <div className="landing-step-num">02</div>
                            <h3 className="landing-step-title">Draw the movement</h3>
                            <p className="landing-step-desc">
                                Add runs, passing lanes, pressing triggers, and key notes.
                            </p>
                        </div>

                        <div className="landing-step-card">
                            <div className="landing-step-num">03</div>
                            <h3 className="landing-step-title">Save and share</h3>
                            <p className="landing-step-desc">
                                Keep scenarios organized and bring a clearer plan to the team.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PWA & OFFLINE SECTION ── */}
            <section className="landing-pwa-section" id="offline-pwa">
                <div className="landing-pwa-inner landing-container">
                    <div className="landing-pill-tag" style={{ marginBottom: '16px' }}>
                        <span>OFFLINE READY • PROGRESSIVE WEB APP</span>
                    </div>
                    <h2 className="landing-section-title">
                        Your tactics, ready<br />
                        when inspiration hits.
                    </h2>
                    <p className="landing-section-desc">
                        TacticBoard dapat dipasang langsung ke perangkat Anda (Windows, Mac, Android, iOS) tanpa perlu instalasi rumit.
                        Setelah dipasang, semua formasi, simulasi gerakan, dan coretan taktik dapat dibuka dan digunakan secara <strong>100% offline tanpa kuota internet</strong>.
                    </p>

                    <div style={{ margin: '24px 0' }}>
                        <button
                            onClick={promptInstall}
                            className="landing-pwa-btn-cta"
                            id="btn-install-pwa-section"
                        >
                            <i className={isInstalled ? "ti ti-device-mobile-check" : "ti ti-download"} style={{ fontSize: '1.25rem' }}></i>
                            <span>{isInstalled ? "✓ Aplikasi Sudah Terpasang di Perangkat" : "Unduh & Pasang Sekarang (Offline Ready)"}</span>
                        </button>
                    </div>

                    <ul className="landing-pwa-checklist">
                        <li className="landing-pwa-check-item">
                            <span className="landing-check-icon">✓</span>
                            <span>Install from a supported browser (Chrome, Edge, Safari, Opera)</span>
                        </li>
                        <li className="landing-pwa-check-item">
                            <span className="landing-check-icon">✓</span>
                            <span>Responsive across desktop, tablet, and mobile</span>
                        </li>
                        <li className="landing-pwa-check-item">
                            <span className="landing-check-icon">✓</span>
                            <span>Offline support planned for saved work (100% offline ready di lapangan)</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* ── FINAL CTA BANNER ── */}
            <section className="landing-cta-section" id="about">
                <div className="landing-container">
                    <div className="landing-cta-card">
                        <div className="landing-cta-tag">THE NEXT MOVE IS YOURS</div>

                        <h2 className="landing-cta-title">
                            Make your next idea<br />
                            your best game plan.
                        </h2>

                        <p className="landing-cta-desc">
                            Bring clarity to every run, role, and decision.
                        </p>

                        <Link href="/board" className="landing-cta-btn" id="btn-open-tacticboard-bottom">
                            <span>Open TacticBoard</span>
                            <span style={{ fontSize: '18px' }}>↗</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="landing-footer">
                <div className="landing-footer-inner">
                    <div className="landing-footer-top">
                        <div className="landing-footer-brand-wrap">
                            <Link href="/" className="landing-brand">
                                <img src="/logo.png" alt="TacticBoard" className="landing-brand-logo" />
                                <span className="landing-brand-name">TacticBoard</span>
                            </Link>
                            <span className="landing-footer-slogan">Think tactics. Build your game.</span>
                        </div>

                        <ul className="landing-footer-links">
                            <li><a href="#hero" className="landing-footer-link">Product</a></li>
                            <li><a href="#features" className="landing-footer-link">Features</a></li>
                            <li><Link href="/board" className="landing-footer-link">Tactical Board</Link></li>
                            <li><button onClick={promptInstall} className="landing-footer-link" style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}>Unduh App (Offline)</button></li>
                        </ul>
                    </div>

                    <div className="landing-footer-bottom">
                        © 2026 TacticBoard. Designed for the beautiful game.
                    </div>
                </div>
            </footer>

            <PWAInstallModal
                isOpen={showInstallGuide}
                onClose={() => setShowInstallGuide(false)}
                isInstalled={isInstalled}
                isIOS={isIOS}
                isInstallable={isInstallable}
                onInstall={promptInstall}
            />
        </div>
    );
}
