import { processDate } from "../../utils"
import { MessageCard } from "./MessageCard"

export function Messages({ selectedChatUid, selectedChatMessages, ownData, devData, friendDisplayNameMap, friendPfpUrlMap }) {
  
  const renderedMessages = () => {
    let previousId;
    let previousTime;

    return (
      selectedChatMessages.map((message, index) => {
        const previousTimeCreated = previousTime;
        const previousSenderId = previousId;

        const currentSenderId = message.senderId;
        const currentTimeCreated = processDate(message.timeCreated.toDate());

        previousId = currentSenderId
        previousTime = currentTimeCreated;
        
        return (
          <MessageCard
            key={message.id + index}
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

  return (
    <div className="messages overflow-y-support">
      <div className="beginning">
        <span>
          This is the beginning of your conversation with
          {" "}
          <span style={{color: "#ddf"}}>
            {
              selectedChatUid === "globalChat" ?
                "Global Chat"
              : selectedChatUid === ownData.uid ?
                ownData.displayName + " (You)" || "..."
              : selectedChatUid === devData.uid ?
                devData.displayName || "..."
              : friendDisplayNameMap[selectedChatUid] || "..."
            }
          </span>
        </span>
      </div>

      {
        selectedChatMessages &&
        renderedMessages()
      }
    </div>
  )
}