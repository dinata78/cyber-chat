import { getIndicatorClass } from "../../../utils";
import { chatCardOnClick } from "./chatCardOnClick";

export function ChatCard({ ownUid, displayName, username, title, uid, status, pfpUrl, unreadMessagesCount, setConversationId, selectedChatUid, setSelectedChatUid, chatMessagesRef, chatInputRef }) {

  return (
    <div 
      className={uid === selectedChatUid ? "chat-card selected" : "chat-card"} 
      onClick={
        () => 
        chatCardOnClick({
          ownUid: ownUid,
          chatUid: uid,
          setConversationId: setConversationId,
          selectedChatUid: selectedChatUid,
          setSelectedChatUid: setSelectedChatUid,
          chatMessagesRef: chatMessagesRef,
          chatInputRef: chatInputRef,
        })
      }
    >

      <div className="chat-card-pfp">
        <img src={uid === "globalChat" ? "/globe.webp" : pfpUrl || "/empty-pfp.webp"} />
          <div className={getIndicatorClass(status)}></div>
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