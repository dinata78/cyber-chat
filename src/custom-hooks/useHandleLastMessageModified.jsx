import { useEffect, useRef } from "react";
import { loadImagesAndScrollTo } from "../utils";

export function useHandleLastMessageModified(messagesRef, selectedChatMessages, ownUid) {
  const prevLastMessage = useRef(null);

  const messageslength = selectedChatMessages?.length;
  const lastMessage = selectedChatMessages?.[messageslength - 1]

  useEffect(() => {
    const handleLastMessageModified = async () => {
      if (lastMessage?.senderUid === ownUid) {
        await loadImagesAndScrollTo(messagesRef.current, { top: "max", behavior: "smooth" });
      }
      else {
        const messagesScrollBottom = messagesRef.current.scrollHeight - messagesRef.current.scrollTop - messagesRef.current.clientHeight;

        if (messagesScrollBottom < messagesRef.current.clientHeight) {
          await loadImagesAndScrollTo(messagesRef.current, { top: "max", behavior: "smooth" });
        }
      }
    }

    if (JSON.stringify(lastMessage) !== JSON.stringify(prevLastMessage.current)) {
      handleLastMessageModified();
      prevLastMessage.current = lastMessage;
    }
    
  }, [selectedChatMessages]);
}