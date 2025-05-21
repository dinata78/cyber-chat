import { getIndicatorClass } from "../../../utils";
import { chatCardOnClick } from "./chatCardOnClick";

export function ChatCard({ ownUid, uid, displayName, username, status, pfpUrl, unreadMessagesCount, selectedChatUid, setSelectedChatUid, setIsSidebarVisible, chatMessagesRef, messageInputRef }) {

  const handleChatCardOnClick = () => {
    chatCardOnClick({
      ownUid: ownUid,
      chatUid: uid,
      selectedChatUid: selectedChatUid,
      setSelectedChatUid: setSelectedChatUid,
      setIsSidebarVisible: setIsSidebarVisible,
      chatMessagesRef: chatMessagesRef,
      messageInputRef: messageInputRef,
    });
  }

  return (
    <div 
      tabIndex={0}
      className={
        uid === selectedChatUid ? "chat-card selected"
        : "chat-card"
      } 
      onClick={handleChatCardOnClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleChatCardOnClick();
        }
      }}
    >

      <div className="pfp">
        <img 
          src={
            uid === "globalChat" ? "/globe.webp"
            : pfpUrl || "/empty-pfp.webp"
          }
        />
        <div className={getIndicatorClass(status)}></div>
      </div>

      <div className="name">
        <span className="display-name">
          {displayName || "Loading..."}
        </span>
        {
          username &&
          <span className="username">
            @{username}
          </span>
        }
      </div>

      {
        uid !== selectedChatUid &&
        unreadMessagesCount > 0 &&
        <span
          className="unread-count"
          style={{fontSize: unreadMessagesCount > 9 ? "8px" : "11px"}}
        >
          {unreadMessagesCount < 100 ? unreadMessagesCount : "99+"}
        </span>
      }

    </div>
  )
}