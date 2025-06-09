import { loadImagesAndScrollToBottom } from "../../../utils";

export function chatCardOnClick({ ownUid, chatUid, selectedChatUid, setSelectedChatUid, setIsSidebarVisible, messagesRef, messageInputRef }) {
  
  if (!ownUid) return;
  if (chatUid === selectedChatUid) return;
  
  setSelectedChatUid(chatUid);

  setIsSidebarVisible(false);

  requestAnimationFrame(() => {
    messageInputRef?.current?.focus();

    loadImagesAndScrollToBottom(messagesRef.current);
    
  });
  
}