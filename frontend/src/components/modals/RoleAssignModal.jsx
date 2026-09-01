import React, { useState } from 'react';
import { TC, POS_LABEL } from '../../data/tacticData';
import { rolesForPlayer } from '../../utils/helpers';
import { ROLE_EXAMPLES } from '../../data/examples';

const RoleAssignModal = ({ selectedPlayer, setSelectedPlayer, pendingRole, setPendingRole, setAssignedRoles, roster, players, setPlayers }) => {
  const [pendingPlayerId, setPendingPlayerId] = useState(() => selectedPlayer?.rosterPlayerId || null);

  React.useEffect(() => {
    if (selectedPlayer) {
      setPendingPlayerId(selectedPlayer.rosterPlayerId || null);
    }
  }, [selectedPlayer]);

  if (!selectedPlayer) return null;

  const matchedPlayers = (roster || []).filter(p => p.position === selectedPlayer.posType);
  const otherPlayers = (roster || []).filter(p => p.position !== selectedPlayer.posType);

  return (
    <div className="overlay open" onClick={(e) => { if (e.target === e.currentTarget) setSelectedPlayer(null); }}>
      <div className="modal" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="mh">
          <div className="mbadge" style={{ background: TC[selectedPlayer.posType], fontSize: 13 }}>{POS_LABEL[selectedPlayer.posType]}</div>
          <div>
            <div className="mtitle">{`Pilih Peran & Pemain — ${POS_LABEL[selectedPlayer.posType]}`}</div>
            <div className="msub">{`${rolesForPlayer(selectedPlayer).length} role tersedia`}</div>
          </div>
          <button className="mclose" onClick={() => setSelectedPlayer(null)}>&#x2715;</button>
        </div>
        <div className="mb">
          <div className="rg">
            <div className="rl">{`1. Pilih Peran (Role) ${selectedPlayer.posType}`}</div>
            {rolesForPlayer(selectedPlayer).map(r => (
              <button key={r.id} className={`ro ${pendingRole === r.id ? 'sel' : ''}`} onClick={() => setPendingRole(r.id)}>
                <div className="ro-n"><span style={{ background: TC[r.posType], color: '#fff', fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 4 }}>{r.short}</span>{r.name}</div>
                <div className="ro-d">{r.desc}</div>
                <div className="ro-tags">
                  <span className="ro-tag" style={{ background: 'transparent', color: '#9ca3af', padding: 0 }}>
                    💡 Contoh: {ROLE_EXAMPLES[r.id] || "-"}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {pendingRole && (
            <div className="rg" style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
              <div className="rl">2. Pilih Pemain dari Tim ({roster?.length || 0})</div>
              {!roster || roster.length === 0 ? (
                  <div style={{ padding: '10px', color: '#888', fontSize: '13px' }}>Belum ada pemain di daftar tim.</div>
              ) : (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingBottom: '10px' }}>
                      {matchedPlayers.map(p => (
                          <button 
                              key={p.id}
                              className={`ro ${pendingPlayerId === p.id ? 'sel' : ''}`}
                              style={{ flex: '0 0 auto', minWidth: '120px', padding: '8px', border: '1px solid var(--blue)' }}
                              onClick={() => setPendingPlayerId(p.id === pendingPlayerId ? null : p.id)}
                          >
                              <div style={{ fontWeight: 'bold' }}>{p.name}</div>
                              <div style={{ fontSize: '11px', color: '#888' }}>#{p.number} • {p.position}</div>
                          </button>
                      ))}
                      {otherPlayers.map(p => (
                          <button 
                              key={p.id}
                              className={`ro ${pendingPlayerId === p.id ? 'sel' : ''}`}
                              style={{ flex: '0 0 auto', minWidth: '120px', padding: '8px', opacity: 0.8 }}
                              onClick={() => setPendingPlayerId(p.id === pendingPlayerId ? null : p.id)}
                          >
                              <div style={{ fontWeight: 'bold' }}>{p.name}</div>
                              <div style={{ fontSize: '11px', color: '#888' }}>#{p.number} • {p.position}</div>
                          </button>
                      ))}
                  </div>
              )}
            </div>
          )}
        </div>
        <div className="mf">
          <button onClick={() => {
            setAssignedRoles(prev => { const next = { ...prev }; delete next[selectedPlayer.id]; return next; });
            setPlayers(prev => prev.map(p => p.id === selectedPlayer.id ? { ...p, rosterPlayerId: null, rosterPlayerName: null } : p));
            setSelectedPlayer(null);
          }}><i className="ti ti-eraser"></i> Hapus</button>
          <button className="ok" onClick={() => {
            if (pendingRole) setAssignedRoles(prev => ({ ...prev, [selectedPlayer.id]: pendingRole }));
            if (pendingPlayerId) {
                const p = roster.find(r => r.id === pendingPlayerId);
                setPlayers(prev => prev.map(pl => pl.id === selectedPlayer.id ? { ...pl, rosterPlayerId: pendingPlayerId, rosterPlayerName: p?.name } : pl));
            } else {
                setPlayers(prev => prev.map(pl => pl.id === selectedPlayer.id ? { ...pl, rosterPlayerId: null, rosterPlayerName: null } : pl));
            }
            setSelectedPlayer(null);
          }}>Simpan</button>
        </div>
      </div>
    </div>
  );
};
export default RoleAssignModal;
