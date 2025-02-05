import { useTrackOnlineStatus } from "../../../custom-hooks/useTrackOnlineStatus";
import { getIndicatorClass } from "../../../utils";
import { onChatCardClick } from "./onChatCardClick";

export function ChatCard(
  { 
    type, 
    currentChatName, 
    name, 
    title, 
    uid, 
    ownUid, 
    setCurrentChatData, 
    setCurrentChatContent,
    usernamesMap, 
    setUsernamesMap,
    unsubscribeSnapshot,
    setSelectedChatUid
  }
) {
  let status = null;

  if (type === "special") {
    status = "online"
  }
  else {
    const { onlineStatus } = useTrackOnlineStatus(uid);
    status = onlineStatus;
  }

  return (
    <div 
      className={
        currentChatName === name ? 
          "chat-card selected" 
        : "chat-card"
      } 
      onClick={
        () => 
        onChatCardClick(
          name,
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
        <span className="chat-card-name">{name}</span>
        <span className="chat-card-title">{title}</span>
      </div>

    </div>
  )
}