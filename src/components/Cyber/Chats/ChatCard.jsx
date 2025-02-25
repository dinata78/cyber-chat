import { useOnlineStatus } from "../../../custom-hooks/useOnlineStatus";
import { getIndicatorClass } from "../../../utils";
import { onChatCardClick } from "./onChatCardClick";

export function ChatCard(
  { 
    displayName, 
    title, 
    uid, 
    ownUid, 
    setCurrentChatData, 
    setCurrentChatContent,
    usernamesMap, 
    setUsernamesMap,
    unsubscribeSnapshot,
    selectedChatUid,
    setSelectedChatUid
  }
) {
  let status = null;

  if (displayName === "Global Chat") {
    status = "online"
  }
  else {
    const { onlineStatus } = useOnlineStatus(uid);
    status = onlineStatus;
  }

  return (
    <div 
      className={
        uid === selectedChatUid ? 
          "chat-card selected" 
        : "chat-card"
      } 
      onClick={
        () => 
        onChatCardClick(
          displayName,
          title,
          uid,
          ownUid,
          setCurrentChatData,
          setCurrentChatContent,
          usernamesMap,
          setUsernamesMap,
          unsubscribeSnapshot,
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