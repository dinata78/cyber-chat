import { getIndicatorClass } from "../../../utils";
import { chatCardOnClick } from "./chatCardOnClick";

export function ChatCard({ ownUid, displayName, title, uid, status, unreadMessagesCount, setCurrentChatData, setConversationId, selectedChatUid, setSelectedChatUid }) {

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
          selectedChatUid,
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
        <span className="name">{displayName}</span>
        <span className="title">{title}</span>
      </div>

      {
        uid !== selectedChatUid &&
        unreadMessagesCount > 0 &&
        <label className="unread-count">
          {unreadMessagesCount}
        </label>
      }

    </div>
  )
}