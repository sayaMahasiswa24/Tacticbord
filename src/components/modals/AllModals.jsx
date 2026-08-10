import React from 'react';
import { ROLE_MASTER, FORMATIONS, STYLE_PRESETS, TC, POS_LABEL } from '../../data/tacticData';
import { rolesForPlayer } from '../../utils/helpers';

const AllModals = ({
  // States
  selectedPlayer, setSelectedPlayer, pendingRole, setPendingRole, setAssignedRoles,
  isStyleModalOpen, setIsStyleModalOpen, applyStyle, activeStyleId,
  isBrowserOpen, setIsBrowserOpen,
  isSaveOpen, setIsSaveOpen, saveName, setSaveName, saveNote, setSaveNote, saveTacticToStorage,
  isLoadOpen, setIsLoadOpen, loadTacticFromStorage, deleteSaveFromStorage,
  isAIChatOpen, setIsAIChatOpen, chatHistory, chatInput, setChatInput, chatBusy, sendChatMessage,
  isResetConfirmOpen, setIsResetConfirmOpen, doFullReset
}) => {
  return (
    <>
      {/* 1. ROLE ASSIGN MODAL */}
      {selectedPlayer && (
        <div className="overlay open" onClick={(e) => { if(e.target === e.currentTarget) setSelectedPlayer(null); }}>
          <div className="modal">
            <div className="mh">
              <div className="mbadge" style={{background: TC[selectedPlayer.posType], fontSize:13}}>{POS_LABEL[selectedPlayer.posType]}</div>
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
                    <div className="ro-n"><span style={{background:TC[r.posType], color:'#fff', fontSize:9, fontWeight:800, padding:'1px 5px', borderRadius:4}}>{r.short}</span>{r.name}</div>
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
                setAssignedRoles(prev => { const next = {...prev}; delete next[selectedPlayer.id]; return next; });
                setSelectedPlayer(null);
              }}><i className="ti ti-eraser"></i> Hapus Peran</button>
              <button className="ok" onClick={() => {
                if(pendingRole) setAssignedRoles(prev => ({...prev, [selectedPlayer.id]: pendingRole}));
                setSelectedPlayer(null);
              }}>Simpan Peran</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. GAYA BERMAIN MODAL */}
      {isStyleModalOpen && (
        <div className="overlay open" onClick={(e) => { if(e.target === e.currentTarget) setIsStyleModalOpen(false); }}>
          <div className="modal wide">
            <div className="mh">
              <div style={{fontSize:24}}>🎭</div>
              <div><div className="mtitle">Preset Gaya Bermain</div><div className="msub">Otomatis isi formasi + peran</div></div>
              <button className="mclose" onClick={() => setIsStyleModalOpen(false)}>&#x2715;</button>
            </div>
            <div className="mb">
              <div className="style-grid">
                {Object.entries(STYLE_PRESETS).map(([id, style]) => (
                  <button key={id} className={`style-card ${activeStyleId === id ? 'active' : ''}`} onClick={() => applyStyle(id)}>
                    <div className="style-card-head"><span className="style-emoji">{style.emoji}</span><span className="style-name">{style.name}</span></div>
                    <div className="style-desc">{style.desc}</div>
                    <div className="ro-tags" style={{marginTop:7}}>
                      <span className="ro-tag">{FORMATIONS[style.formation].name}</span>
                      <span className="ro-tag">{`lebar ×${style.modifiers.widthMult}`}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="mf"><button onClick={() => setIsStyleModalOpen(false)}>Tutup</button></div>
          </div>
        </div>
      )}

      {/* 3. ROLE BROWSER MODAL */}
      {isBrowserOpen && (
        <div className="overlay open" onClick={(e) => { if(e.target === e.currentTarget) setIsBrowserOpen(false); }}>
          <div className="modal wide">
            <div className="mh">
              <div style={{fontSize:24}}>📚</div>
              <div><div className="mtitle">Role Database</div><div className="msub">29 role lengkap</div></div>
              <button className="mclose" onClick={() => setIsBrowserOpen(false)}>&#x2715;</button>
            </div>
            <div className="mb">
              {['GK','DEF','MID','FWD'].map(group => {
                const groupNames = {GK:'Kiper',DEF:'Bertahan',MID:'Gelandang',FWD:'Penyerang'};
                const roles = ROLE_MASTER.filter(r => r.posGroup === group);
                if(!roles.length) return null;
                return (
                  <div key={group} className="rg">
                    <div className="rl">{`${groupNames[group]} (${roles.length})`}</div>
                    {roles.map(r => (
                      <div key={r.id} className="rl-card">
                        <div className="rl-head"><span className="rl-badge" style={{background:TC[r.posType]}}>{r.short}</span><span className="rl-name">{r.name}</span><span className="rl-pos">{`${r.posType} · ${r.side}`}</span></div>
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
      )}

      {/* 4. SAVE MODAL */}
      {isSaveOpen && (
        <div className="overlay open" onClick={(e) => { if(e.target === e.currentTarget) setIsSaveOpen(false); }}>
          <div className="modal">
            <div className="mh">
              <div style={{fontSize:22}}>💾</div>
              <div><div className="mtitle">Simpan Taktik</div><div className="msub">Tersimpan lokal di browser</div></div>
              <button className="mclose" onClick={() => setIsSaveOpen(false)}>&#x2715;</button>
            </div>
            <div className="mb">
              <div className="save-input-row"><label>Nama taktik</label><input type="text" value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="cth: High Press 4-3-3" maxLength={60} /></div>
              <div className="save-input-row"><label>Catatan (opsional)</label><input type="text" value={saveNote} onChange={(e) => setSaveNote(e.target.value)} placeholder="cth: Untuk lawan bertahan rendah" /></div>
            </div>
            <div className="mf"><button onClick={() => setIsSaveOpen(false)}>Batal</button><button className="ok" onClick={saveTacticToStorage}><i className="ti ti-device-floppy"></i> Simpan</button></div>
          </div>
        </div>
      )}

      {/* 5. LOAD MODAL */}
      {isLoadOpen && (
        <div className="overlay open" onClick={(e) => { if(e.target === e.currentTarget) setIsLoadOpen(false); }}>
          <div className="modal wide">
            <div className="mh">
              <div style={{fontSize:22}}>📂</div>
              <div><div className="mtitle">Muat Taktik</div><div className="msub">Pilih taktik tersimpan</div></div>
              <button className="mclose" onClick={() => setIsLoadOpen(false)}>&#x2715;</button>
            </div>
            <div className="mb" style={{minHeight:120}}>
              {(() => {
                const saves = JSON.parse(localStorage.getItem('tacticbord_v2') || '[]');
                if(!saves.length) return <div className="empty-saves">Belum ada taktik tersimpan.</div>;
                return saves.map((s, idx) => (
                  <div key={idx} className="save-item" onClick={() => loadTacticFromStorage(idx)}>
                    <div style={{fontSize:20}}>📋</div>
                    <div style={{flex:1, minWidth:0}}><div className="save-item-name">{s.name}</div><div className="save-item-info">{`${s.formationName||s.formation} · ${s.note?s.note+' · ':''}${new Date(s.savedAt).toLocaleDateString('id-ID')}`}</div></div>
                    <button className="save-item-del" onClick={(e) => deleteSaveFromStorage(e, idx)}><i className="ti ti-trash"></i></button>
                  </div>
                ));
              })()}
            </div>
            <div className="mf"><button onClick={() => setIsLoadOpen(false)}>Tutup</button></div>
          </div>
        </div>
      )}

      {/* 6. AI CHAT MODAL */}
      {isAIChatOpen && (
        <div className="overlay open" onClick={(e) => { if(e.target === e.currentTarget) setIsAIChatOpen(false); }}>
          <div className="modal chat-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mh">
              <div style={{fontSize:22}}>🤖</div>
              <div><div className="mtitle">Asisten Taktik AI</div><div className="msub">Bertanya soal saran & solusi taktis</div></div>
              <button className="mclose" onClick={() => setIsAIChatOpen(false)}>&#x2715;</button>
            </div>
            <div className="chat-log">
              {chatHistory.length === 0 && <div className="chat-empty">💡 Tanyakan apa saja soal taktik sepak bola! (Asisten ini dikonfigurasi khusus untuk membahas sepak bola saja)</div>}
              {chatHistory.map((m, i) => (
                <div key={i} className={`chat-msg ${m.role === 'user' ? 'user' : 'ai'}`}>
                  {m.role === 'user' ? m.content : <span dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, '<br>') }} />}
                </div>
              ))}
              {chatBusy && <div className="chat-loading"><div className="chat-spinner"></div><span>Menganalisis...</span></div>}
            </div>
            <div className="chat-input-row">
              <textarea rows={1} value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Tulis pertanyaan taktikmu..." onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }} />
              <button className="chat-send-btn" disabled={chatBusy} onClick={() => sendChatMessage()}><i className="ti ti-send"></i></button>
            </div>
          </div>
        </div>
      )}

      {/* 7. RESET CONFIRM MODAL */}
      {isResetConfirmOpen && (
        <div className="overlay open" onClick={(e) => { if(e.target === e.currentTarget) setIsResetConfirmOpen(false); }}>
          <div className="modal">
            <div className="mh">
              <div style={{fontSize:22}}>⚠️</div>
              <div><div className="mtitle">Reset Formasi?</div><div className="msub">Semua peran & posisi akan kembali ke awal</div></div>
              <button className="mclose" onClick={() => setIsResetConfirmOpen(false)}>&#x2715;</button>
            </div>
            <div className="mf"><button onClick={() => setIsResetConfirmOpen(false)}>Batal</button><button className="danger" onClick={doFullReset}><i className="ti ti-refresh"></i> Ya, Reset</button></div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllModals;