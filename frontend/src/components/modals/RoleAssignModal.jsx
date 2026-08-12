import React from 'react';
import { TC, POS_LABEL } from '../../data/tacticData';
import { rolesForPlayer } from '../../utils/helpers';
const RoleAssignModal = ({ selectedPlayer, setSelectedPlayer, pendingRole, setPendingRole, setAssignedRoles }) => {
  if (!selectedPlayer) return null;
  return (
    <div className="overlay open" onClick={(e) => { if (e.target === e.currentTarget) setSelectedPlayer(null); }}>
      <div className="modal">
        <div className="mh">
          <div className="mbadge" style={{ background: TC[selectedPlayer.posType], fontSize: 13 }}>{POS_LABEL[selectedPlayer.posType]}</div>
          <div>
            <div className="mtitle">{`Pilih Peran — ${POS_LABEL[selectedPlayer.posType]}`}</div>
            <div className="msub">{`${rolesForPlayer(selectedPlayer).length} role tersedia untuk posisi ${selectedPlayer.posType}`}</div>
          </div>
          <button className="mclose" onClick={() => setSelectedPlayer(null)}>&#x2715;</button>
        </div>
        <div className="mb">
          <div className="rg">
            <div className="rl">{`Semua Role ${selectedPlayer.posType}`}</div>
            {rolesForPlayer(selectedPlayer).map(r => (
              <button key={r.id} className={`ro ${pendingRole === r.id ? 'sel' : ''}`} onClick={() => setPendingRole(r.id)}>
                <div className="ro-n"><span style={{ background: TC[r.posType], color: '#fff', fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 4 }}>{r.short}</span>{r.name}</div>
                <div className="ro-d">{r.desc}</div>
                <div className="ro-tags">
                  <span className="ro-tag">{`width ${r.width}`}</span><span className="ro-tag">{`depth ${r.depth}`}</span>
                  <span className="ro-tag">{r.pressing}</span>
                  {r.overlap !== 'none' && <span className="ro-tag">{r.overlap}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="mf">
          <button onClick={() => {
            setAssignedRoles(prev => { const next = { ...prev }; delete next[selectedPlayer.id]; return next; });
            setSelectedPlayer(null);
          }}><i className="ti ti-eraser"></i> Hapus Peran</button>
          <button className="ok" onClick={() => {
            if (pendingRole) setAssignedRoles(prev => ({ ...prev, [selectedPlayer.id]: pendingRole }));
            setSelectedPlayer(null);
          }}>Simpan Peran</button>
        </div>
      </div>
    </div>
  );
};
export default RoleAssignModal;
