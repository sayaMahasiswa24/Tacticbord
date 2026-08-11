import React from 'react';

const ResetConfirmModal = ({ isResetConfirmOpen, setIsResetConfirmOpen, doFullReset }) => {
  if (!isResetConfirmOpen) return null;

  return (
    <div className="overlay open" onClick={(e) => { if (e.target === e.currentTarget) setIsResetConfirmOpen(false); }}>
      <div className="modal">
        <div className="mh">
          <div style={{ fontSize: 22 }}>⚠️</div>
          <div><div className="mtitle">Reset Formasi?</div><div className="msub">Semua peran & posisi akan kembali ke awal</div></div>
          <button className="mclose" onClick={() => setIsResetConfirmOpen(false)}>&#x2715;</button>
        </div>
        <div className="mf"><button onClick={() => setIsResetConfirmOpen(false)}>Batal</button><button className="danger" onClick={doFullReset}><i className="ti ti-refresh"></i> Ya, Reset</button></div>
      </div>
    </div>
  );
};

export default ResetConfirmModal;
