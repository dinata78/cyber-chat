import { getIndicatorClass } from "../../../utils";
import { chatCardOnClick } from "./chatCardOnClick";

export function ChatCard({ ownUid, displayName, username, title, uid, status, unreadMessagesCount, setCurrentChatData, setConversationId, selectedChatUid, setSelectedChatUid, messageEndRef }) {

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
          setSelectedChatUid,
          messageEndRef
        )
      }
    >

      <div className="chat-card-pfp">
        <img src="/empty-pfp.webp" />
          <div className={getIndicatorClass(status)}>
          </div>
      </div>

      <div className="chat-card-info">
        <div className="name">
          <span className="display-name">{displayName}</span>
          {
            username &&
            <span className="username">@{username}</span>
          }
        </div>
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