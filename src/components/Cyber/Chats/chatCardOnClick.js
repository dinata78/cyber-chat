import { getConversationId } from "../../../utils";

export function chatCardOnClick(ownUid, chatData, setCurrentChatData, setConversationId, selectedChatUid, setSelectedChatUid, chatMessagesRef) {
  
  if (!ownUid) return;
  if (chatData.uid === selectedChatUid) return;

  const conversationId = getConversationId(ownUid, chatData.uid);

  setConversationId(conversationId);
  
  setSelectedChatUid(chatData.uid);
  
  setCurrentChatData({
    displayName: chatData.displayName,
    title: chatData.title,
    uid: chatData.uid
  });

  setTimeout(() => chatMessagesRef.current.scrollTo({ top: chatMessagesRef.current.scrollHeight - chatMessagesRef.current.clientHeight, behavior: "smooth" }), 0);
  
}