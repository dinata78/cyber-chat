import { useEffect, useState } from "react";
import { Messages } from "./Messages";
import { MessageInput } from "./MessageInput";
import { ArrowDownSVG } from "../../svg";
import { loadImagesAndScrollToBottom } from "../../../utils";

export function Message({ ownData, isSidebarVisible, setIsSidebarVisible, selectedChatUid, messagesRef, messageInputRef, selectedChatMessages, chatDisplayNameMap, chatPfpUrlMap }) {
  
  const [ messagesScrollBottom, setMessagesScrollBottom ] = useState(0);
  const [ messageValueMap, setMessageValueMap ] = useState({});
  const [ replyingId, setReplyingId ] = useState(null);
  const [ isLastMessageEditing, setIsLastMessageEditing ] = useState(false);

  const replyingMessage = selectedChatMessages?.filter(message => message.id === replyingId)?.[0];
  const replyingMessageSenderName = chatDisplayNameMap[replyingMessage?.senderUid];

  const scrollNewest = async () => {
    await loadImagesAndScrollToBottom(messagesRef.current);
  }

  useEffect(() => {
    const handleScroll = () => {
      const messagesBottom = messagesRef.current.scrollHeight - messagesRef.current.scrollTop - messagesRef.current.clientHeight;
      setMessagesScrollBottom(messagesBottom);
    }

    messagesRef.current.addEventListener("scroll", handleScroll);

    return () => messagesRef.current.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      id="chat-message"
      className="overflow-y-support"
      onClick={() => setIsSidebarVisible(false)}
    >
      <Messages
        ownData={ownData}
        messagesRef={messagesRef}
        setReplyingId={setReplyingId}
        isReplying={replyingMessage ? true : false}
        isLastMessageEditing={isLastMessageEditing}
        closeLastMessageEdit={() => setIsLastMessageEditing(false)}
        selectedChatUid={selectedChatUid}
        selectedChatMessages={selectedChatMessages}
        chatDisplayNameMap={chatDisplayNameMap}
        chatPfpUrlMap={chatPfpUrlMap}
      />
      
      <div className="footer">
        {
          messagesScrollBottom > messagesRef.current?.clientHeight &&
          <button className="scroll-newest" onClick={scrollNewest}>
            <ArrowDownSVG />
          </button>
        }
      </div>

      <MessageInput
        messagesRef={messagesRef}
        messageInputRef={messageInputRef}
        messageValueMap={messageValueMap}
        setMessageValueMap={setMessageValueMap}
        replyingId={replyingId}
        replyingMessage={replyingMessage}
        replyingMessageSenderName={replyingMessageSenderName}
        stopReplying={() => setReplyingId(null)}
        editLastMessage={() => setIsLastMessageEditing(true)}
        ownUid={ownData.uid}
        selectedChatUid={selectedChatUid}
      />

      {
        isSidebarVisible &&
        <div className="dark-overlay"></div>
      }

    </div>
  )
}