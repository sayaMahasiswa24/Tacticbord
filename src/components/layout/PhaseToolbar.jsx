import React from 'react';

const PhaseToolbar = ({ phase, triggerPhase, simSpd, setSimSpd, overlays, setOverlays }) => {
  return (
    <div className="phasebar">
      <span className="pb-label">Fase:</span>
      <button className={`phbtn ${phase === 'possession' ? 'on-poss' : ''}`} onClick={() => triggerPhase('possession')}>
        <div className="dot" style={{background:'#0ea5e9'}}></div>⚽ In Poss
      </button>
      <button className={`phbtn ${phase === 'transition_pos' ? 'on-tp' : ''}`} onClick={() => triggerPhase('transition_pos')}>
        <div className="dot" style={{background:'#d97706'}}></div>↗ Counter
      </button>
      <button className={`phbtn ${phase === 'transition_neg' ? 'on-tn' : ''}`} onClick={() => triggerPhase('transition_neg')}>
        <div className="dot" style={{background:'#7c3aed'}}></div>🔄 Press
      </button>
      <button className={`phbtn ${phase === 'defense' ? 'on-def' : ''}`} onClick={() => triggerPhase('defense')}>
        <div className="dot" style={{background:'#dc2626'}}></div>🛡 Out Poss
      </button>
      
      <div className="pb-right">
        <span className="mini-lbl">Speed:</span>
        <div className="spd-group">
          <button className={`spd ${simSpd === 0.5 ? 'on' : ''}`} onClick={() => setSimSpd(0.5)}>0.5×</button>
          <button className={`spd ${simSpd === 1 ? 'on' : ''}`} onClick={() => setSimSpd(1)}>1×</button>
          <button className={`spd ${simSpd === 2 ? 'on' : ''}`} onClick={() => setSimSpd(2)}>2×</button>
        </div>
        <button className={`ovbtn ${overlays.zone ? 'on' : ''}`} onClick={() => setOverlays(p => ({...p, zone: !p.zone}))}>
          <i className="ti ti-layout-rows" style={{fontSize:13}}></i>Zona
        </button>
        <button className={`ovbtn ${overlays.pass ? 'on' : ''}`} onClick={() => setOverlays(p => ({...p, pass: !p.pass}))}>
          <i className="ti ti-arrows-exchange" style={{fontSize:13}}></i>Pass
        </button>
      </div>
    </div>
  );
};

export default PhaseToolbar;