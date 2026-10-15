import React from 'react';

const LoadTacticModal = ({ isLoadOpen, setIsLoadOpen, loadTacticFromStorage, deleteSaveFromStorage, allSaves = [] }) => {
  if (!isLoadOpen) return null;

  const saves = (allSaves && allSaves.length > 0)
    ? allSaves
    : JSON.parse(localStorage.getItem('tacticbord_v2') || '[]');

  return (
    <div className="overlay open" onClick={(e) => { if (e.target === e.currentTarget) setIsLoadOpen(false); }}>
      <div className="modal wide">
        <div className="mh">
          <div style={{ fontSize: 22 }}>📂</div>
          <div><div className="mtitle">Muat Taktik</div><div className="msub">Pilih taktik tersimpan dari SQLite / Browser</div></div>
          <button className="mclose" onClick={() => setIsLoadOpen(false)}>&#x2715;</button>
        </div>
        <div className="mb" style={{ minHeight: 120 }}>
          {!saves.length ? (
            <div className="empty-saves">Belum ada taktik tersimpan.</div>
          ) : (
            saves.map((s, idx) => (
              <div key={s.id || idx} className="save-item" onClick={() => loadTacticFromStorage(idx)}>
                <div style={{ fontSize: 20 }}>📋</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="save-item-name">{s.title || s.name}</div>
                  <div className="save-item-info">
                    {`${s.formationName || s.formation} · ${s.note ? s.note + ' · ' : ''}${s.savedAt ? new Date(s.savedAt).toLocaleDateString('id-ID') : 'Database'}`}
                  </div>
                </div>
                <button
                  className="save-item-del"
                  onClick={(e) => deleteSaveFromStorage(e, idx)}
                  title="Hapus taktik"
                >
                  <i className="ti ti-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>
        <div className="mf"><button onClick={() => setIsLoadOpen(false)}>Tutup</button></div>
      </div>
    </div>
  );
};

export default LoadTacticModal;
