import React, { useState } from 'react';

const PitchSidebar = ({
  phase, triggerPhase,
  simSpd, setSimSpd,
  overlays, setOverlays,
  zoom, setZoom
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const phases = [
    { id: 'possession',      label: 'In Poss',  emoji: '⚽', color: '#3b82f6', activeClass: 'sb-phase--poss'   },
    { id: 'transition_pos',  label: 'Counter',   emoji: '↗',  color: '#f59e0b', activeClass: 'sb-phase--tp'     },
    { id: 'transition_neg',  label: 'Press',     emoji: '🔄', color: '#8b5cf6', activeClass: 'sb-phase--tn'     },
    { id: 'defense',         label: 'Out Poss',  emoji: '🛡', color: '#ef4444', activeClass: 'sb-phase--def'    },
  ];

  const activePhase = phases.find(p => p.id === phase);

  return (
    <div className={`pitch-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Toggle Button */}
      <button
        className="sb-toggle"
        onClick={() => setIsExpanded(prev => !prev)}
        aria-label={isExpanded ? 'Tutup sidebar' : 'Buka sidebar'}
      >
        <i className={`ti ${isExpanded ? 'ti-chevron-left' : 'ti-chevron-right'}`}></i>
      </button>

      {/* ── Collapsed Mini Indicators ── */}
      {!isExpanded && (
        <div className="sb-mini">
          <div
            className="sb-mini-dot"
            style={{ background: activePhase?.color || 'var(--txt3)' }}
            title={activePhase?.label || 'No phase'}
          ></div>
          <span className="sb-mini-zoom">{zoom.toFixed(1)}×</span>
        </div>
      )}

      {/* ── Expanded Content ── */}
      {isExpanded && (
        <div className="sb-content">
          {/* Phase Section */}
          <div className="sb-section">
            <div className="sb-section-label">Fase</div>
            <div className="sb-phase-group">
              {phases.map(ph => (
                <button
                  key={ph.id}
                  className={`sb-phase-btn ${phase === ph.id ? ph.activeClass : ''}`}
                  onClick={() => triggerPhase(ph.id)}
                >
                  <div className="sb-phase-dot" style={{ background: ph.color }}></div>
                  <span className="sb-phase-label">{ph.emoji} {ph.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Speed Section */}
          <div className="sb-section">
            <div className="sb-section-label">Speed</div>
            <div className="sb-speed-group">
              {[0.5, 1, 2].map(s => (
                <button
                  key={s}
                  className={`sb-speed-btn ${simSpd === s ? 'active' : ''}`}
                  onClick={() => setSimSpd(s)}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>

          {/* Overlay Section */}
          <div className="sb-section">
            <div className="sb-section-label">Overlay</div>
            <div className="sb-overlay-group">
              <button
                className={`sb-overlay-btn ${overlays.zone ? 'active' : ''}`}
                onClick={() => setOverlays(p => ({ ...p, zone: !p.zone }))}
              >
                <i className="ti ti-layout-rows" style={{ fontSize: 13 }}></i>
                <span>Zona</span>
              </button>
              <button
                className={`sb-overlay-btn ${overlays.pass ? 'active' : ''}`}
                onClick={() => setOverlays(p => ({ ...p, pass: !p.pass }))}
              >
                <i className="ti ti-arrows-exchange" style={{ fontSize: 13 }}></i>
                <span>Pass</span>
              </button>
            </div>
          </div>

          {/* Zoom Section */}
          <div className="sb-section sb-zoom-section">
            <div className="sb-section-label">Zoom</div>
            <div className="sb-zoom-group">
              <button
                className="sb-zoom-btn"
                onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))}
                aria-label="Zoom in"
              >
                <i className="ti ti-plus"></i>
              </button>
              <button
                className="sb-zoom-reset"
                onClick={() => setZoom(1)}
                title="Reset zoom"
              >
                {zoom.toFixed(1)}×
              </button>
              <button
                className="sb-zoom-btn"
                onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
                aria-label="Zoom out"
              >
                <i className="ti ti-minus"></i>
              </button>
            </div>
            {/* Zoom level indicator bar */}
            <div className="sb-zoom-track">
              <div
                className="sb-zoom-fill"
                style={{ width: `${((zoom - 0.5) / 2) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PitchSidebar;
