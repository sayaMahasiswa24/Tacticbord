import React from 'react';
const SaveTacticModal = ({ isSaveOpen, setIsSaveOpen, saveName, setSaveName, saveNote, setSaveNote, saveTacticToStorage }) => {
  if (!isSaveOpen) return null;
  return (
    <div className="overlay open" onClick={(e) => { if (e.target === e.currentTarget) setIsSaveOpen(false); }}>
      <div className="modal">
        <div className="mh">
          <div style={{ fontSize: 22 }}>💾</div>
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
  );
};
export default SaveTacticModal;
