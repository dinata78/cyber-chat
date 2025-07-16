import { getIndicatorClass } from "../../../utils";
import { CloseSVG } from "../../svg";
import { chatCardOnClick } from "./chatCardOnClick";

export function ChatCard({ ownUid, uid, displayName, username, status, pfpUrl, unreadMessagesCount, selectedChatUid, setSelectedChatUid, setIsSidebarVisible, isDM, hideDM }) {
  const isSelected = uid === selectedChatUid;

  const handleChatCardOnClick = () => {
    chatCardOnClick({
      ownUid: ownUid,
      chatUid: uid,
      selectedChatUid: selectedChatUid,
      setSelectedChatUid: setSelectedChatUid,
      setIsSidebarVisible: setIsSidebarVisible,
    });
  }

  return (
    <div 
      tabIndex={0}
      className={isSelected ? "chat-card selected" : "chat-card"}
      onClick={handleChatCardOnClick}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
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
        <span className="display-name text-overflow-support">
          {displayName || "Loading..."}
        </span>
        {
          username &&
          <span className="username text-overflow-support">
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

      {
        isSelected && isDM &&
        <button
          className="hide-dm"
          onClick={hideDM}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.stopPropagation();
              hideDM();
            }
          }}
        >
          <CloseSVG />
        </button>
      }

    </div>
  )
}