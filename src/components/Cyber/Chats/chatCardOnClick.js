import { getConversationId } from "../../../utils";

export function chatCardOnClick({ ownUid, chatUid, setConversationId, selectedChatUid, setSelectedChatUid, chatMessagesRef }) {
  
  if (!ownUid) return;
  if (chatUid === selectedChatUid) return;

  const conversationId = getConversationId(ownUid, chatUid);

  setConversationId(conversationId);
  
  setSelectedChatUid(chatUid);

  requestAnimationFrame(() => {
    chatMessagesRef.current.scrollTo({
      top: chatMessagesRef.current.scrollHeight - chatMessagesRef.current.clientHeight,
      behavior: "smooth",
    })
  });
  
}