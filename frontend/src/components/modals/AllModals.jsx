import React from 'react';
import RoleAssignModal from './RoleAssignModal';
import StyleModal from './StyleModal';
import RoleBrowserModal from './RoleBrowserModal';
import SaveTacticModal from './SaveTacticModal';
import LoadTacticModal from './LoadTacticModal';
import AIChatModal from './AIChatModal';
import ResetConfirmModal from './ResetConfirmModal';
import TutorialModal from './TutorialModal';
const AllModals = ({
  selectedPlayer, setSelectedPlayer, pendingRole, setPendingRole, setAssignedRoles,
  isStyleModalOpen, setIsStyleModalOpen, applyStyle, activeStyleId,
  isBrowserOpen, setIsBrowserOpen,
  isSaveOpen, setIsSaveOpen, saveName, setSaveName, saveNote, setSaveNote, saveTacticToStorage,
  isLoadOpen, setIsLoadOpen, loadTacticFromStorage, deleteSaveFromStorage,
  isAIChatOpen, setIsAIChatOpen, chatHistory, chatInput, setChatInput, chatBusy, sendChatMessage,
  isResetConfirmOpen, setIsResetConfirmOpen, doFullReset,
  isTutorialOpen, setIsTutorialOpen
}) => {
  return (
    <>
      <RoleAssignModal
        selectedPlayer={selectedPlayer}
        setSelectedPlayer={setSelectedPlayer}
        pendingRole={pendingRole}
        setPendingRole={setPendingRole}
        setAssignedRoles={setAssignedRoles}
      />
      <StyleModal
        isStyleModalOpen={isStyleModalOpen}
        setIsStyleModalOpen={setIsStyleModalOpen}
        applyStyle={applyStyle}
        activeStyleId={activeStyleId}
      />
      <RoleBrowserModal
        isBrowserOpen={isBrowserOpen}
        setIsBrowserOpen={setIsBrowserOpen}
      />
      <SaveTacticModal
        isSaveOpen={isSaveOpen}
        setIsSaveOpen={setIsSaveOpen}
        saveName={saveName}
        setSaveName={setSaveName}
        saveNote={saveNote}
        setSaveNote={setSaveNote}
        saveTacticToStorage={saveTacticToStorage}
      />
      <LoadTacticModal
        isLoadOpen={isLoadOpen}
        setIsLoadOpen={setIsLoadOpen}
        loadTacticFromStorage={loadTacticFromStorage}
        deleteSaveFromStorage={deleteSaveFromStorage}
      />
      <AIChatModal
        isAIChatOpen={isAIChatOpen}
        setIsAIChatOpen={setIsAIChatOpen}
        chatHistory={chatHistory}
        chatInput={chatInput}
        setChatInput={setChatInput}
        chatBusy={chatBusy}
        sendChatMessage={sendChatMessage}
      />
      <ResetConfirmModal
        isResetConfirmOpen={isResetConfirmOpen}
        setIsResetConfirmOpen={setIsResetConfirmOpen}
        doFullReset={doFullReset}
      />
      <TutorialModal
        isTutorialOpen={isTutorialOpen}
        setIsTutorialOpen={setIsTutorialOpen}
      />
    </>
  );
};
export default AllModals;