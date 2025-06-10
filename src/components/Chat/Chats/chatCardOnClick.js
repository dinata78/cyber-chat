
export function chatCardOnClick({ ownUid, chatUid, selectedChatUid, setSelectedChatUid, setIsSidebarVisible }) {
  
  if (!ownUid) return;
  if (chatUid === selectedChatUid) return;
  
  setSelectedChatUid(chatUid);

  setIsSidebarVisible(false);  
}