import { Fragment, useEffect, useState } from "react";
import { getConversationId, processDate } from "../../../utils"
import { MessageCard } from "./MessageCard"
import { MessageDelete } from "./MessageDelete";
import { ReplyingMessage } from "./ReplyingMessage";
import { MessageReport } from "./MessageReport";

export function Messages({ ownData, messagesRef, focusMessageInput, setReplyingId, isReplying, isLastMessageEditing, setIsLastMessageEditing, selectedChatUid, selectedChatMessages, selectedChatUnreadCount, selectedChatMessagesAmount, addSelectedChatMessagesAmount, chatDisplayNameMap, chatPfpUrlMap }) {

  const [ hoveredId, setHoveredId ] = useState(null);
  const [ editingId, setEditingId ] = useState(null);
  const [ isDeleting, setIsDeleting ] = useState(false);
  const [ deletingData, setDeletingData ] = useState({ messageId: "", timeCreated: "", type: "", content: "..." });
  const [ isReporting, setIsReporting ] = useState(false);
  const [ reportingData, setReportingData ] = useState({ messageId: "", timeCreated: "", type: "", content: "..." });

  const hasMoreMessages = selectedChatMessages?.length === selectedChatMessagesAmount;

  const lastMessageIndex = selectedChatMessages?.length - 1;
  const lastMessageId = selectedChatMessages?.[lastMessageIndex]?.id;
  const isLastMessageEditable = selectedChatMessages?.[lastMessageIndex]?.type === "text" && !selectedChatMessages?.[lastMessageIndex].isDeleted;
  
  const renderedMessages = () => {
    let previousUid;
    let previousTime;
    let unreadMessagesStartIndex;

    if (selectedChatUnreadCount) {
      const index = selectedChatMessages.length - selectedChatUnreadCount;
      unreadMessagesStartIndex = index > 0 ? index : 0;
    }

    return (
      selectedChatMessages.map((message, index) => {
        const replyingMessage = selectedChatMessages?.filter(chatMessage => chatMessage.id === message.isReplyingId)?.[0];
        
        const previousTimeCreated = previousTime;
        const previousSenderUid = previousUid;

        const currentSenderUid = message.senderUid;
        const currentTimeCreated = processDate(message.timeCreated.toDate());

        previousUid = currentSenderUid;
        previousTime = currentTimeCreated;
        
        return (
          <Fragment key={message.id + index}>
            {
              index === unreadMessagesStartIndex &&
              <div id="unread-indicator">
                <hr />
                <span>NEW</span>
              </div>
            }

            {
              replyingMessage &&
              <ReplyingMessage
                replyingMessage={replyingMessage}
                senderPfpUrl={chatPfpUrlMap?.[replyingMessage?.senderUid]}
                senderDisplayName={chatDisplayNameMap?.[replyingMessage?.senderUid]}
              />
            }

            <MessageCard
              focusMessageInput={focusMessageInput}
              conversationId={getConversationId(ownData.uid, selectedChatUid)}
              messageId={message.id}
              isHovered={message.id === hoveredId}
              setHoveredId={setHoveredId}
              setReplyingId={setReplyingId}
              isEditing={message.id === editingId}
              setEditingId={setEditingId}
              setIsDeleting={setIsDeleting}
              setDeletingData={setDeletingData}
              setIsReporting={setIsReporting}
              setReportingData={setReportingData}
              isOwn={currentSenderUid === ownData.uid}
              isSubset={
                currentSenderUid === previousSenderUid &&
                currentTimeCreated === previousTimeCreated
              }
              isReplyingId={message.isReplyingId}
              isDeleted={message.isDeleted}
              isEdited={message.isEdited}
              isSending={message.isSending}
              senderPfpUrl={chatPfpUrlMap[currentSenderUid]}
              senderDisplayName={chatDisplayNameMap[currentSenderUid] || "..."}
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
      if (isLastMessageEditable) setEditingId(lastMessageId);
      setIsLastMessageEditing(false);
    }
  }, [isLastMessageEditing]);

  useEffect(() => {
    if (editingId === lastMessageId) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight - messagesRef.current.clientHeight,
      });
    }
  }, [editingId]);

  return (
    <div
      ref={messagesRef}
      className="messages overflow-y-support"
      style={{paddingBottom: isReplying && "76px"}}
    >

      {
        !hasMoreMessages &&
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
      }

      {
        hasMoreMessages &&
        <div className="load-messages">
          <button onClick={() => addSelectedChatMessagesAmount(25)}>
            Load More Messages
          </button>
        </div>
      }

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
              messageId: "",
              timeCreated: "",
              type: "",
              content: "...",
            });
          }}
          conversationId={getConversationId(ownData.uid, selectedChatUid)}
          deletingData={{
            ...deletingData,
            pfpUrl: ownData.pfpUrl,
            displayName: ownData.displayName,
          }}
        />
      }

      {
        isReporting &&
        <MessageReport
          closeModal={() => {
            setIsReporting(false);
            setReportingData({
              messageId: "",
              timeCreated: "",
              pfpUrl: "",
              displayName: "",
              type: "",
              content: "...",
            });
          }}
          ownUid={ownData.uid}
          conversationId={getConversationId(ownData.uid, selectedChatUid)}
          reportingData={reportingData}
        />
      }
    </div>
  )
}