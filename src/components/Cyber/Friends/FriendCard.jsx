import { useTrackOnlineStatus } from "../../../custom-hooks/useTrackOnlineStatus";
import { getIndicatorClass } from "../../../utils";
import { AccountMinusSVG } from "../../svg/AccountMinusSVG";
import { ChatSVG } from "../../svg/ChatSVG";

export function FriendCard({ friendUid, friendName, friendTitle }) {
  const { onlineStatus } = useTrackOnlineStatus(friendUid);

  return (
    <div className="friend-card">

      <div className="friend-card-pfp">
        <img src="/empty-pfp.webp" />
        <div 
          className={
            getIndicatorClass(onlineStatus)}
        >
        </div>
      </div>

      <div className="friend-card-info">
        <span className="friend-card-name">{friendName}</span>
        <span className="friend-card-title">{friendTitle}</span>
      </div>

      <div className="friend-card-buttons">
        <button title="Chat">
          <ChatSVG />
        </button>
        <button title="Remove Friend">
          <AccountMinusSVG />
        </button>
      </div>
      
    </div>
  )
}