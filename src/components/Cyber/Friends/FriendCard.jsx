import { useTrackOnlineStatus } from "../../../custom-hooks/useTrackOnlineStatus";
import { getIndicatorClass } from "../../../utils";
import { AccountMinusSVG } from "../../svg/AccountMinusSVG";
import { ChatSVG } from "../../svg/ChatSVG";
import { addInbox } from "./addInbox";
import { removeFriend } from "./removeFriend";

export function FriendCard({ ownUid, friendUid, friendName, friendTitle }) {
  const { onlineStatus } = useTrackOnlineStatus(friendUid);

  const friendRemove = async (ownUid, friendUid) => {
    await removeFriend(ownUid, friendUid);
    await removeFriend(friendUid, ownUid);
    await addInbox(ownUid, "friend-removed", friendUid);
    await addInbox(friendUid, "friend-removed", ownUid);
  }

  return (
    <div className="friend-card">

      <div className="friend-card-pfp">
        <img src="/empty-pfp.webp" />
        <div 
          className={
            getIndicatorClass(onlineStatus)
          }
        >
        </div>
      </div>

      <div className="friend-card-info">
        <span className="friend-card-name">{friendName}</span>
        <span className="friend-card-title">{friendTitle}</span>
      </div>

      <div className="friend-card-buttons">
        <button
          title="Chat"
        >
          <ChatSVG />
        </button>
        <button 
          title="Remove Friend"
          onClick={() => friendRemove(ownUid, friendUid)}
        >
          <AccountMinusSVG />
        </button>
      </div>
      
    </div>
  )
}