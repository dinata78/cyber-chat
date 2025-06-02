import { useState } from "react";
import { Messages } from "./Messages";
import { MessageInput } from "./MessageInput";

export function Message({ ownData, isSidebarVisible, setIsSidebarVisible, selectedChatUid, messagesRef, messageInputRef, selectedChatMessages, chatDisplayNameMap, chatPfpUrlMap }) {

  const [ replyingId, setReplyingId ] = useState(null);
  const [ isLastMessageEditing, setIsLastMessageEditing ] = useState(false);

  const replyingMessage = selectedChatMessages?.filter(message => message.id === replyingId)?.[0];
  const replyingMessageSenderName = chatDisplayNameMap[replyingMessage?.senderId];

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
        isLastMessageEditing={isLastMessageEditing}
        closeLastMessageEdit={() => setIsLastMessageEditing(false)}
        selectedChatUid={selectedChatUid}
        selectedChatMessages={selectedChatMessages}
        chatDisplayNameMap={chatDisplayNameMap}
        chatPfpUrlMap={chatPfpUrlMap}
      />
      
      <div className="footer"></div>

      <MessageInput
        messageInputRef={messageInputRef}
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