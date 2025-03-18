import { getConversationId } from "../../../utils";

export function chatCardOnClick(ownUid, chatData, setCurrentChatData, setConversationId, selectedChatUid, setSelectedChatUid, messageEndRef) {
  
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

  setTimeout(() => messageEndRef.current.scrollIntoView({ behavior: "smooth" }), 0);
}