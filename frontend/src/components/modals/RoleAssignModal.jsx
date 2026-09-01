import React, { useState } from 'react';
import { TC, POS_LABEL } from '../../data/tacticData';
import { rolesForPlayer } from '../../utils/helpers';
import { ROLE_EXAMPLES } from '../../data/examples';

const RoleAssignModal = ({ selectedPlayer, setSelectedPlayer, pendingRole, setPendingRole, setAssignedRoles, roster, players, setPlayers }) => {
  const [pendingPlayerId, setPendingPlayerId] = useState(() => selectedPlayer?.rosterPlayerId || null);
  const [step, setStep] = useState(1);

  React.useEffect(() => {
    if (selectedPlayer) {
      setPendingPlayerId(selectedPlayer.rosterPlayerId || null);
      setStep(1);
    }
  }, [selectedPlayer]);

  if (!selectedPlayer) return null;

  const matchedPlayers = (roster || []).filter(p => p.position === selectedPlayer.posType);
  const otherPlayers = (roster || []).filter(p => p.position !== selectedPlayer.posType);
  const combinedPlayers = [...matchedPlayers, ...otherPlayers];

  return (
    <div className="overlay open" onClick={(e) => { if (e.target === e.currentTarget) setSelectedPlayer(null); }}>
      <div className="modal" style={{ maxHeight: '90vh', overflowY: 'auto', background: '#1e1e1e', color: '#fff', borderRadius: '16px', border: '1px solid #333', maxWidth: '400px' }}>
        <div className="mh" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <div className="mbadge" style={{ background: TC[selectedPlayer.posType] || 'var(--orange)', fontSize: 13, width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {POS_LABEL[selectedPlayer.posType]}
          </div>
          <div style={{ flex: 1, marginLeft: '12px', cursor: step === 2 ? 'pointer' : 'default' }} onClick={() => step === 2 && setStep(1)}>
            <div className="mtitle" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 'bold' }}>
              {step === 2 && <i className="ti ti-chevron-left" style={{ fontSize: '16px' }}></i>}
              {`Pilih Peran — ${POS_LABEL[selectedPlayer.posType]}`}
            </div>
            <div className="msub" style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>{`${rolesForPlayer(selectedPlayer).length} role tersedia untuk posisi ${POS_LABEL[selectedPlayer.posType]}`}</div>
          </div>
          <button className="mclose" onClick={() => setSelectedPlayer(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>&#x2715;</button>
        </div>
        
        <div className="mb" style={{ padding: '16px' }}>
          {step === 1 && (
            <div className="rg">
              <div className="rl" style={{ textAlign: 'center', borderBottom: 'none', color: '#888', fontSize: '10px', letterSpacing: '1px', marginBottom: '16px', textTransform: 'uppercase' }}>SEMUA ROLE {POS_LABEL[selectedPlayer.posType]}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rolesForPlayer(selectedPlayer).map(r => (
                  <button 
                    key={r.id} 
                    className={`ro ${pendingRole === r.id ? 'sel' : ''}`} 
                    onClick={() => {
                      setPendingRole(r.id);
                      setStep(2);
                    }}
                    style={{ background: '#111', border: pendingRole === r.id ? `1px solid ${TC[r.posType]}` : '1px solid #333', borderRadius: '12px', padding: '16px', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '6px' }}
                  >
                    <div className="ro-n" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: TC[r.posType], color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>{r.short}</span>
                      <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{r.name}</span>
                    </div>
                    <div className="ro-d" style={{ color: '#aaa', fontSize: '12px', lineHeight: '1.5' }}>{r.desc}</div>
                    <div className="ro-tags" style={{ marginTop: '4px' }}>
                      <span className="ro-tag" style={{ background: 'transparent', color: '#888', padding: 0, fontSize: '11px' }}>
                        💡 Contoh: {ROLE_EXAMPLES[r.id] || "-"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rg">
              <div className="rl" style={{ textAlign: 'center', borderBottom: 'none', color: '#888', fontSize: '10px', letterSpacing: '1px', marginBottom: '16px', textTransform: 'uppercase' }}>PEMAIN TERSEDIA</div>
              {!roster || roster.length === 0 ? (
                  <div style={{ padding: '20px', color: '#888', fontSize: '13px', textAlign: 'center', background: '#111', borderRadius: '12px' }}>Belum ada pemain di daftar tim.</div>
              ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {combinedPlayers.map(p => (
                          <button 
                              key={p.id}
                              onClick={() => setPendingPlayerId(p.id === pendingPlayerId ? null : p.id)}
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                background: '#111', 
                                border: pendingPlayerId === p.id ? `1px solid ${TC[selectedPlayer.posType] || 'var(--orange)'}` : '1px solid #333', 
                                padding: '12px 16px', 
                                borderRadius: '12px',
                                width: '100%',
                                textAlign: 'left',
                                opacity: p.position === selectedPlayer.posType ? 1 : 0.6,
                                cursor: 'pointer'
                              }}
                          >
                              <div style={{ 
                                background: TC[selectedPlayer.posType] || 'var(--orange)', 
                                color: '#fff', 
                                width: '36px', 
                                height: '36px', 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                marginRight: '16px',
                                flexShrink: 0,
                                fontSize: '14px'
                              }}>
                                {p.number || "-"}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#fff', marginBottom: '4px' }}>{p.name}</div>
                                <div style={{ fontSize: '11px', color: '#aaa' }}>
                                  {p.foot?.toLowerCase() === 'kiri' ? 'Left foot' : p.foot?.toLowerCase() === 'kanan' ? 'Right foot' : p.foot || 'Both feet'} • {p.position}
                                </div>
                              </div>
                              <div style={{ 
                                background: '#ddd', 
                                color: '#000', 
                                padding: '6px 16px', 
                                fontSize: '11px', 
                                fontWeight: 'bold', 
                                borderRadius: '4px',
                                minWidth: '60px',
                                textAlign: 'center'
                              }}>
                                {p.squad || "Squad"}
                              </div>
                          </button>
                      ))}
                  </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mf" style={{ padding: '16px', borderTop: '1px solid #333', display: 'flex', gap: '12px' }}>
          <button style={{ flex: 1, background: '#2a2a2a', border: 'none', color: '#aaa', padding: '14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }} onClick={() => {
            setAssignedRoles(prev => { const next = { ...prev }; delete next[selectedPlayer.id]; return next; });
            setPlayers(prev => prev.map(p => p.id === selectedPlayer.id ? { ...p, rosterPlayerId: null, rosterPlayerName: null } : p));
            setSelectedPlayer(null);
          }}>Hapus Peran</button>
          
          <button style={{ flex: 1, background: '#fff', border: 'none', color: '#000', padding: '14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }} onClick={() => {
            if (pendingRole) setAssignedRoles(prev => ({ ...prev, [selectedPlayer.id]: pendingRole }));
            if (pendingPlayerId) {
                const p = roster.find(r => r.id === pendingPlayerId);
                setPlayers(prev => prev.map(pl => pl.id === selectedPlayer.id ? { ...pl, rosterPlayerId: pendingPlayerId, rosterPlayerName: p?.name } : pl));
            } else {
                setPlayers(prev => prev.map(pl => pl.id === selectedPlayer.id ? { ...pl, rosterPlayerId: null, rosterPlayerName: null } : pl));
            }
            setSelectedPlayer(null);
          }}>Simpan Peran</button>
        </div>
      </div>
    </div>
  );
};

export default RoleAssignModal;
