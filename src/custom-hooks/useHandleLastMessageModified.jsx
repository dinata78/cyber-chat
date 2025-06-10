import { useEffect, useRef } from "react";
import { loadImagesAndScrollToBottom } from "../utils";

export function useHandleLastMessageModified(messagesRef, selectedChatMessages, ownUid) {
  const prevLastMessage = useRef(null);

  const messageslength = selectedChatMessages?.length;
  const lastMessage = selectedChatMessages?.[messageslength - 1]

  useEffect(() => {
    const handleLastMessageModified = async () => {
      if (lastMessage?.senderUid === ownUid) {
        await loadImagesAndScrollToBottom(messagesRef.current);
      }
      else {
        const messagesScrollBottom = messagesRef.current.scrollHeight - messagesRef.current.scrollTop - messagesRef.current.clientHeight;

        if (messagesScrollBottom < messagesRef.current.clientHeight) {
          await loadImagesAndScrollToBottom(messagesRef.current);
        }
      }
    }

    if (JSON.stringify(lastMessage) !== JSON.stringify(prevLastMessage.current)) {
      handleLastMessageModified();
      prevLastMessage.current = lastMessage;
    }
    
  }, [selectedChatMessages]);
}