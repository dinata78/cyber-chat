import { useEffect, useState } from "react";
import { getConversationId, processDate } from "../../utils"
import { MessageCard } from "./MessageCard"
import { MessageDelete } from "./MessageDelete";

export function Messages({ selectedChatUid, selectedChatMessages, isLastMessageEditing, closeLastMessageEdit, ownData, devData, friendDisplayNameMap, friendPfpUrlMap }) {

  const [ hoveredId, setHoveredId ] = useState(null);
  const [ editingId, setEditingId ] = useState(null);
  const [ isDeleting, setIsDeleting ] = useState(false);
  const [ deletingData, setDeletingData ] = useState({ id: "", timeCreated: "", type: "", content: "..." })
  
  const renderedMessages = () => {
    let previousId;
    let previousTime;

    return (
      selectedChatMessages.map((message, index) => {
        const previousTimeCreated = previousTime;
        const previousSenderId = previousId;

        const currentSenderId = message.senderId;
        const currentTimeCreated = processDate(message.timeCreated.toDate());

        previousId = currentSenderId;
        previousTime = currentTimeCreated;
        
        return (
          <MessageCard
            key={message.id + index}
            conversationId={getConversationId(ownData.uid, selectedChatUid)}
            messageId={message.id}
            isHovered={message.id === hoveredId}
            setHoveredId={setHoveredId}
            isEditing={message.id === editingId}
            setEditingId={setEditingId}
            setIsDeleting={setIsDeleting}
            setDeletingData={setDeletingData}
            isOwn={currentSenderId === ownData.uid}
            isSubset={
              currentSenderId === previousSenderId &&
              currentTimeCreated === previousTimeCreated
            }
            isDeleted={message.isDeleted}
            isEdited={message.isEdited}
            isSending={message.isSending}
            senderPfpUrl={
              currentSenderId === ownData.uid ? ownData.pfpUrl
              : currentSenderId === devData.uid ? devData.pfpUrl
              : friendPfpUrlMap[message.senderId]
            }
            senderName={
              currentSenderId === ownData.uid ? ownData.displayName
              : currentSenderId === devData.uid ? devData.displayName
              : friendDisplayNameMap[message.senderId]
            }
            timeCreated={currentTimeCreated}
            type={message.type}
            content={message.content}
          />
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
    <div className="messages overflow-y-support">
      <div className="beginning">
        <span>
          This is the beginning of your conversation with
          {" "}
          <span style={{wordBreak: "break-word", color: "#ddf"}}>
            {
              selectedChatUid === "globalChat" ? "Global Chat"
              : selectedChatUid === ownData.uid ? ownData.displayName + " (You)" || "..."
              : selectedChatUid === devData.uid ? devData.displayName || "..."
              : friendDisplayNameMap[selectedChatUid] || "..."
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