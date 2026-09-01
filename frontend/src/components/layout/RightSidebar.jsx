import React, { useState, useRef } from 'react';

const POSITIONS = ['CF', 'W', 'AM', 'CM', 'DM', 'WB', 'FB', 'CB', 'GK'];

const RightSidebar = ({
  roster, addPlayer, addPlayers, updatePlayer, deletePlayer,
  scenario,
  setIsBrowserOpen, setIsSaveOpen, setIsLoadOpen
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('roster'); // roster, record

  // Form states
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [foot, setFoot] = useState('kanan');
  const [position, setPosition] = useState('CF');
  const [squad, setSquad] = useState('Utama');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addPlayer({
      name: name.trim(),
      number: number.trim(),
      foot,
      position,
      squad
    });
    setName('');
    setNumber('');
  };

  const fileInputRef = useRef(null);

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      
      if (lines.length === 0) return;

      // Check if first row is header
      const firstRow = lines[0].toLowerCase();
      let startIdx = 0;
      if (firstRow.includes('id') || firstRow.includes('nama')) {
        startIdx = 1;
      }

      const newPlayers = [];

      for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i];
        // Split by comma or semicolon
        const cols = line.split(/[,;]/).map(c => c.trim());
        
        // Expected columns: ID, NAMA, NOMER PUNGGUNG, POSISI, SQUAD/SUB, KAKI
        if (cols.length >= 2) { // At least needs a name
          const nama = cols[1] || `Pemain ${i}`;
          const nomer = cols[2] || '';
          
          let rawPos = (cols[3] || 'CF').toUpperCase();
          // Auto mapping
          if (['LB', 'RB'].includes(rawPos)) rawPos = 'FB';
          else if (['LWB', 'RWB'].includes(rawPos)) rawPos = 'WB';
          else if (['LW', 'RW'].includes(rawPos)) rawPos = 'W';
          else if (rawPos === 'ST') rawPos = 'CF';
          else if (rawPos === 'CAM') rawPos = 'AM';
          else if (rawPos === 'CDM') rawPos = 'DM';
          
          if (!POSITIONS.includes(rawPos)) rawPos = 'CF'; // fallback

          const squadVal = cols[4] || 'Utama';
          const kakiVal = (cols[5] || 'kanan').toLowerCase();
          const footVal = kakiVal.includes('kiri') ? 'kiri' : 'kanan';

          newPlayers.push({
            name: nama,
            number: nomer,
            position: rawPos,
            squad: squadVal,
            foot: footVal
          });
        }
      }

      if (newPlayers.length > 0) {
        addPlayers(newPlayers);
        // showToast could be called here if it was passed, but it's fine
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className={`right-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button
        className="sb-toggle"
        onClick={() => setIsExpanded(prev => !prev)}
        aria-label={isExpanded ? 'Tutup sidebar kanan' : 'Buka sidebar kanan'}
      >
        <i className={`ti ${isExpanded ? 'ti-chevron-right' : 'ti-chevron-left'}`}></i>
      </button>

      {isExpanded && (
        <div className="sb-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
            <button 
              className={`sb-phase-btn ${activeTab === 'roster' ? 'sb-phase--poss' : ''}`}
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setActiveTab('roster')}
            >
              Tim
            </button>
            <button 
              className={`sb-phase-btn ${activeTab === 'record' ? 'sb-phase--poss' : ''}`}
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setActiveTab('record')}
            >
              Skenario
            </button>
          </div>

          {activeTab === 'roster' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div className="sb-section" style={{ border: 'none', padding: 0 }}>
                <div className="sb-section-label">Tambah Pemain</div>
                <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <input 
                    type="text" 
                    placeholder="Nama Pemain" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--txt)' }}
                    required
                  />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input 
                      type="number" 
                      placeholder="No." 
                      value={number} 
                      onChange={e => setNumber(e.target.value)}
                      style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--txt)' }}
                    />
                    <select value={foot} onChange={e => setFoot(e.target.value)} style={{ flex: 1.5, padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--txt)' }}>
                      <option value="kanan">Kanan</option>
                      <option value="kiri">Kiri</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <select value={position} onChange={e => setPosition(e.target.value)} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--txt)' }}>
                      {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <select value={squad} onChange={e => setSquad(e.target.value)} style={{ flex: 1.5, padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--txt)' }}>
                      <option value="Utama">Utama</option>
                      <option value="Cadangan">Cadangan</option>
                    </select>
                  </div>
                  <button type="submit" style={{ padding: '6px', borderRadius: '6px', background: 'var(--blue)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    Tambah
                  </button>
                </form>
              </div>

              <div className="sb-section" style={{ border: 'none', padding: 0 }}>
                <div className="sb-section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Daftar Pemain ({roster.length})</span>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    style={{ background: 'var(--blue)', border: 'none', color: '#fff', fontSize: '10px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <i className="ti ti-file-import"></i> CSV
                  </button>
                  <input 
                    type="file" 
                    accept=".csv" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleImportCSV}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '180px', overflowY: 'auto' }}>
                  {roster.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 'bold' }}>{p.number && `#${p.number} `}{p.name}</span>
                        <span style={{ color: 'var(--txt3)', fontSize: '10px' }}>{p.position} • {p.foot} • {p.squad}</span>
                      </div>
                      <button onClick={() => deletePlayer(p.id)} style={{ background: 'transparent', border: 'none', color: 'var(--red)', cursor: 'pointer' }}>
                        <i className="ti ti-trash"></i>
                      </button>
                    </div>
                  ))}
                  {roster.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--txt3)', fontSize: '11px', padding: '10px 0' }}>Belum ada pemain</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'record' && (
            <div className="sb-section" style={{ border: 'none', padding: 0 }}>
              <div className="sb-section-label">Record per Layer</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  className="sb-phase-btn"
                  style={{ justifyContent: 'center', background: 'var(--blue)' }}
                  onClick={() => scenario.recordLayer()}
                  disabled={scenario.isPlaying}
                >
                  <i className="ti ti-camera"></i> Rekam Posisi Saat Ini
                </button>
                
                {scenario.layers.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '150px', overflowY: 'auto', margin: '8px 0' }}>
                    {scenario.layers.map((layer, idx) => (
                      <div key={layer.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '12px' }}>
                        <button 
                          style={{ background: 'transparent', border: 'none', color: scenario.currentLayerIndex === idx ? 'var(--blue)' : 'var(--txt)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => scenario.loadLayer(idx)}
                          disabled={scenario.isPlaying}
                        >
                          <i className="ti ti-layers-intersect"></i> Layer {idx + 1}
                        </button>
                        <button onClick={() => scenario.removeLayer(idx)} style={{ background: 'transparent', border: 'none', color: 'var(--red)', cursor: 'pointer' }} disabled={scenario.isPlaying}>
                          <i className="ti ti-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '6px' }}>
                  {!scenario.isPlaying ? (
                    <button
                      className="sb-phase-btn sb-phase--poss"
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={scenario.playScenario}
                      disabled={scenario.layers.length < 2}
                    >
                      <i className="ti ti-player-play"></i> Mainkan ({scenario.layers.length})
                    </button>
                  ) : (
                    <button
                      className="sb-phase-btn"
                      style={{ flex: 1, justifyContent: 'center', background: 'var(--red)' }}
                      onClick={scenario.stopScenario}
                    >
                      <i className="ti ti-player-stop"></i> Berhenti
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button className="sb-phase-btn" onClick={() => setIsBrowserOpen(true)} style={{ justifyContent: 'center' }}>
              <i className="ti ti-books"></i> Role Database
            </button>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="sb-phase-btn" onClick={() => setIsSaveOpen(true)} style={{ flex: 1, justifyContent: 'center' }}>
                <i className="ti ti-device-floppy"></i> Save
              </button>
              <button className="sb-phase-btn" onClick={() => setIsLoadOpen(true)} style={{ flex: 1, justifyContent: 'center' }}>
                <i className="ti ti-folder-open"></i> Load
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default RightSidebar;
