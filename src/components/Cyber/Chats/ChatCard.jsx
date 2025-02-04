import { useTrackOnlineStatus } from "../../../custom-hooks/useTrackOnlineStatus";
import { getIndicatorClass } from "../../../utils";

export function ChatCard({ type, currentChatName, name, title, uid, onChatCardClick }) {
  let status = null;

  if (type !== "special") {
    const { onlineStatus } = useTrackOnlineStatus(uid);
    status = onlineStatus;
  }
  else {
    status = "online"
  }

  return (
    <div 
      className={
        currentChatName === name ? "chat-card selected" 
        : "chat-card"
      } 
      onClick={
        () => onChatCardClick(name, title, uid)
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