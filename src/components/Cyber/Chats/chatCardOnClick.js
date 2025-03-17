import { getConversationId } from "../../../utils";

export function chatCardOnClick(ownUid, chatData, setCurrentChatData, setConversationId, selectedChatUid, setSelectedChatUid) {
  
  if (!ownUid) return;
  if (selectedChatUid === chatData.uid) return;

  const conversationId = getConversationId(ownUid, chatData.uid);

  setConversationId(conversationId); 
  
  setSelectedChatUid(chatData.uid);
  
  setCurrentChatData({
    displayName: chatData.displayName,
    title: chatData.title,
    uid: chatData.uid
  });
}