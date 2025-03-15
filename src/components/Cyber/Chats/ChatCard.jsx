import { getIndicatorClass } from "../../../utils";
import { chatCardOnClick } from "./chatCardOnClick";

export function ChatCard({ ownUid, displayName, title, uid, status, setCurrentChatData, setConversationId, selectedChatUid, setSelectedChatUid }) {
  
  return (
    <div 
      className={uid === selectedChatUid ? "chat-card selected" : "chat-card"} 
      onClick={
        () => 
        chatCardOnClick(
          ownUid,
          {displayName: displayName, title: title, uid: uid},
          setCurrentChatData,
          setConversationId,
          setSelectedChatUid     
        )
      }
    >

      <div className="chat-card-pfp">
        <img src="/empty-pfp.webp" />
          <div className={getIndicatorClass(status)}>
          </div>
      </div>

      <div className="chat-card-info">
        <span className="chat-card-name">{displayName}</span>
        <span className="chat-card-title">{title}</span>
      </div>

    </div>
  )
}