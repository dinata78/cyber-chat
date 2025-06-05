import { useEffect, useState } from "react";
import { Messages } from "./Messages";
import { MessageInput } from "./MessageInput";
import { useTypingUids } from "../../custom-hooks/useTypingUids";
import { getConversationId } from "../../utils";
import { TypingInfo } from "./TypingInfo";

export function Message({ ownData, isSidebarVisible, setIsSidebarVisible, selectedChatUid, messagesRef, messageInputRef, selectedChatMessages, chatDisplayNameMap, chatPfpUrlMap }) {

  const [ replyingId, setReplyingId ] = useState(null);
  const [ isLastMessageEditing, setIsLastMessageEditing ] = useState(false);

  const { typingUids } = useTypingUids(getConversationId(ownData.uid, selectedChatUid));

  const replyingMessage = selectedChatMessages?.filter(message => message.id === replyingId)?.[0];
  const replyingMessageSenderName = chatDisplayNameMap[replyingMessage?.senderId];

  useEffect(() => {
    console.log(typingUids)
  }, [typingUids]);

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
          <TypingInfo
            typingUids={typingUids.filter(uid => uid !== ownData.uid)}
            chatDisplayNameMap={chatDisplayNameMap}
          />
        }
      </div>

      <MessageInput
        messageInputRef={messageInputRef}
        replyingId={replyingId}
        replyingMessage={replyingMessage}
        replyingMessageSenderName={replyingMessageSenderName}
        stopReplying={() => setReplyingId(null)}
        editLastMessage={() => setIsLastMessageEditing(true)}
        ownUid={ownData.uid}
        selectedChatUid={selectedChatUid}
        typingUids={typingUids}
      />

      {
        isSidebarVisible &&
        <div className="dark-overlay"></div>
      }

    </div>
  )
}