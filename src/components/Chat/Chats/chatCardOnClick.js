
export function chatCardOnClick({ ownUid, chatUid, selectedChatUid, setSelectedChatUid, setIsSidebarVisible, chatMessagesRef, messageInputRef }) {
  
  if (!ownUid) return;
  if (chatUid === selectedChatUid) return;
  
  setSelectedChatUid(chatUid);

  setIsSidebarVisible(false);

  requestAnimationFrame(() => {
    messageInputRef.current.focus();

    chatMessagesRef.current.scrollTo({
      top: chatMessagesRef.current.scrollHeight - chatMessagesRef.current.clientHeight,
      behavior: "smooth",
    });

  });
  
}