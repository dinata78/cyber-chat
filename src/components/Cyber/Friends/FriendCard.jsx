import { AccountMinusSVG } from "../../svg/AccountMinusSVG";
import { ChatSVG } from "../../svg/ChatSVG";

export function FriendCard({ type, friendName, friendTitle, friendStatus }) {
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
        {
          type === "normal" ?
            <>
              <button className="normal" title="Chat">
                <ChatSVG />
              </button>
              <button className="normal" title="Remove Friend">
                <AccountMinusSVG />
              </button>
            </>
          : type === "pending-received" ?
            <>
              <button className="received accept">
                ACCEPT
              </button>
              <button className="received reject">
                REJECT
              </button>
            </>
          : type === "pending-sent" ?
            <>
              <button className="sent">
                CANCEL REQUEST
              </button>      
            </>          
          : null
        }
      </div>
    </div>
  )
}