import { Fragment, useEffect, useState } from "react";
import { getConversationId, processDate } from "../../utils"
import { MessageCard } from "./MessageCard"
import { MessageDelete } from "./MessageDelete";
import { ReplyingMessage } from "./ReplyingMessage";

export function Messages({ ownData, messagesRef, setReplyingId, isLastMessageEditing, closeLastMessageEdit, selectedChatUid, selectedChatMessages, chatDisplayNameMap, chatPfpUrlMap }) {

  const [ hoveredId, setHoveredId ] = useState(null);
  const [ editingId, setEditingId ] = useState(null);
  const [ isDeleting, setIsDeleting ] = useState(false);
  const [ deletingData, setDeletingData ] = useState({ id: "", timeCreated: "", type: "", content: "..." });
  
  const renderedMessages = () => {
    let previousId;
    let previousTime;

    return (
      selectedChatMessages.map((message, index) => {
        const replyingMessage = selectedChatMessages?.filter(chatMessage => chatMessage.id === message.isReplyingId)?.[0];
        
        const previousTimeCreated = previousTime;
        const previousSenderId = previousId;

        const currentSenderId = message.senderId;
        const currentTimeCreated = processDate(message.timeCreated.toDate());

        previousId = currentSenderId;
        previousTime = currentTimeCreated;
        
        return (
          <Fragment key={message.id + index}>
            {
              message.isReplyingId &&
              <ReplyingMessage
                replyingMessage={replyingMessage}
                senderPfpUrl={chatPfpUrlMap?.[replyingMessage?.senderId]}
                senderDisplayName={chatDisplayNameMap?.[replyingMessage?.senderId]}
              />
            }

            <MessageCard
              conversationId={getConversationId(ownData.uid, selectedChatUid)}
              messageId={message.id}
              isHovered={message.id === hoveredId}
              setHoveredId={setHoveredId}
              setReplyingId={setReplyingId}
              isEditing={message.id === editingId}
              setEditingId={setEditingId}
              setIsDeleting={setIsDeleting}
              setDeletingData={setDeletingData}
              isOwn={currentSenderId === ownData.uid}
              isSubset={
                currentSenderId === previousSenderId &&
                currentTimeCreated === previousTimeCreated
              }
              isReplyingId={message.isReplyingId}
              isDeleted={message.isDeleted}
              isEdited={message.isEdited}
              isSending={message.isSending}
              senderPfpUrl={chatPfpUrlMap[currentSenderId]}
              senderName={chatDisplayNameMap[currentSenderId] || "..."}
              timeCreated={currentTimeCreated}
              type={message.type}
              content={message.content}
            />
          </Fragment>
        )
      })     
    )

  };

  useEffect(() => {
    if (isLastMessageEditing) {
      setEditingId(
        selectedChatMessages[selectedChatMessages.length - 1].id
      );
      closeLastMessageEdit();
    }
  }, [isLastMessageEditing]);

  return (
    <div ref={messagesRef} className="messages overflow-y-support">
      <div className="beginning">
        <span>
          This is the beginning of your conversation with
          {" "}
          <span style={{wordBreak: "break-word", color: "#ddf"}}>
            {
              selectedChatUid === "globalChat" ? "Global Chat"
              : chatDisplayNameMap[selectedChatUid] || "..."
            }
          </span>
        </span>
      </div>

      {
        selectedChatMessages &&
        renderedMessages()
      }

      {
        isDeleting &&
        <MessageDelete
          closeModal={() => {
            setIsDeleting(false);
            setDeletingData({
              timeCreated: "",
              content: "..." }
            );
          }}
          conversationId={getConversationId(ownData.uid, selectedChatUid)}
          messageId={deletingData.id}
          senderPfpUrl={ownData.pfpUrl}
          senderDisplayName={ownData.displayName}
          timeCreated={deletingData.timeCreated}
          contentType={deletingData.type}
          content={deletingData.content}
        />
      }
    </div>
  )
}