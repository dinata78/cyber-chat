import { AccountMinusSVG } from "../../svg/AccountMinusSVG";
import { ChatSVG } from "../../svg/ChatSVG";

export function FriendCard({ friendName, friendTitle, friendStatus }) {
  const getIndicator = (friendStatus) => {
    if (friendStatus === "online") return "indicator online";
    else if (friendStatus === "offline") return "indicator offline";
    else if (friendStatus === "hidden") return "indicator hidden";
    else return "indicator";
  }

  return (
    <div className="friend-card">
      <div className="friend-card-pfp">
        <img src="/empty-pfp.webp" />
        <div className={getIndicator(friendStatus)} title={friendStatus.charAt(0).toUpperCase() + friendStatus.slice(1)}></div>
      </div>
      <div className="friend-card-info">
        <span className="friend-card-name">{friendName}</span>
        <span className="friend-card-title">{friendTitle}</span>
      </div>
      <div className="friend-card-buttons">
        <button className="chat" title={"Chat"}>
          <ChatSVG />
        </button>
        <button className="delete" title="Remove Friend">
          <AccountMinusSVG />
        </button>
      </div>
    </div>
  )
}