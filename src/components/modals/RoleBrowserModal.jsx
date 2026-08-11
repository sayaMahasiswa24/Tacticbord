import React from 'react';
import { ROLE_MASTER, TC } from '../../data/tacticData';

const RoleBrowserModal = ({ isBrowserOpen, setIsBrowserOpen }) => {
  if (!isBrowserOpen) return null;

  return (
    <div className="overlay open" onClick={(e) => { if (e.target === e.currentTarget) setIsBrowserOpen(false); }}>
      <div className="modal wide">
        <div className="mh">
          <div style={{ fontSize: 24 }}>📚</div>
          <div><div className="mtitle">Role Database</div><div className="msub">29 role lengkap</div></div>
          <button className="mclose" onClick={() => setIsBrowserOpen(false)}>&#x2715;</button>
        </div>
        <div className="mb">
          {['GK', 'DEF', 'MID', 'FWD'].map(group => {
            const groupNames = { GK: 'Kiper', DEF: 'Bertahan', MID: 'Gelandang', FWD: 'Penyerang' };
            const roles = ROLE_MASTER.filter(r => r.posGroup === group);
            if (!roles.length) return null;
            return (
              <div key={group} className="rg">
                <div className="rl">{`${groupNames[group]} (${roles.length})`}</div>
                {roles.map(r => (
                  <div key={r.id} className="rl-card">
                    <div className="rl-head"><span className="rl-badge" style={{ background: TC[r.posType] }}>{r.short}</span><span className="rl-name">{r.name}</span><span className="rl-pos">{`${r.posType} · ${r.side}`}</span></div>
                    <div className="rl-desc">{r.desc}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div className="mf"><button onClick={() => setIsBrowserOpen(false)}>Tutup</button></div>
      </div>
    </div>
  );
};

export default RoleBrowserModal;
