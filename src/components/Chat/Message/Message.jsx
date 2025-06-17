import { useEffect, useRef, useState } from "react";
import { Messages } from "./Messages";
import { MessageInput } from "./MessageInput";
import { ArrowDownSVG } from "../../svg";
import { loadImagesAndScrollToBottom } from "../../../utils";

export function Message({ ownData, isSidebarVisible, setIsSidebarVisible, selectedChatUid, messagesRef, messageInputRef, selectedChatMessages, chatDisplayNameMap, chatPfpUrlMap }) {
  
  const [ messagesScrollBottom, setMessagesScrollBottom ] = useState(0);
  const [ messageValueMap, setMessageValueMap ] = useState({});
  const [ replyingId, setReplyingId ] = useState(null);
  const [ isLastMessageEditing, setIsLastMessageEditing ] = useState(false);

  const inputContainerRef = useRef(null);

  const replyingMessage = selectedChatMessages?.filter(message => message.id === replyingId)?.[0];
  const replyingMessageSenderName = chatDisplayNameMap[replyingMessage?.senderUid];

  const focusMessageInput = () => {
    messageInputRef.current.focus();
    messageInputRef.current.selectionStart = messageInputRef.current.value.length;
    messageInputRef.current.selectionEnd = messageInputRef.current.value.length;
  }

  const resizeMessageInput = () => {
    if (inputContainerRef.current && messageInputRef.current) {
      console.log("resizing message input..");
      inputContainerRef.current.style.height = "auto";
      inputContainerRef.current.style.height = `${messageInputRef.current.scrollHeight + 24}px`;
      console.log("Done")
    }
  }

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

  useEffect(() => {
    resizeMessageInput();
    setMessagesScrollBottom(0);
    messagesRef.current.scrollTop = 0;
  }, [selectedChatUid]);

  return (
    <div
      id="chat-message"
      className="overflow-y-support"
      onClick={() => setIsSidebarVisible(false)}
    >
      <Messages
        ownData={ownData}
        messagesRef={messagesRef}
        focusMessageInput={focusMessageInput}
        setReplyingId={setReplyingId}
        isReplying={replyingMessage ? true : false}
        isLastMessageEditing={isLastMessageEditing}
        setIsLastMessageEditing={setIsLastMessageEditing}
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
        inputContainerRef={inputContainerRef}
        focusMessageInput={focusMessageInput}
        resizeMessageInput={resizeMessageInput}
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