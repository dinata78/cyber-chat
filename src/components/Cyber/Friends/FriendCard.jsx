import { useNavigate } from "react-router-dom";
import { useTrackOnlineStatus } from "../../../custom-hooks/useTrackOnlineStatus";
import { getIndicatorClass } from "../../../utils";
import { AccountMinusSVG } from "../../svg/AccountMinusSVG";
import { ChatSVG } from "../../svg/ChatSVG";
import { addInbox } from "./addInbox";
import { removeFriend } from "./removeFriend";
import { useName } from "../../../custom-hooks/useName";

export function FriendCard({ ownUid, friendUid, friendName, friendTitle, setSelectedChatUid }) {
  const { onlineStatus } = useTrackOnlineStatus(friendUid);
  const { username } = useName(friendUid);

  const navigate = useNavigate();

  const friendRemove = async (ownUid, friendUid) => {
    await removeFriend(ownUid, friendUid);
    await removeFriend(friendUid, ownUid);
    await addInbox(ownUid, "friend-removed", friendUid);
    await addInbox(friendUid, "friend-removed", ownUid);
  }

  const chatFriend = (friendUid) => {
    navigate("/cyber/chats");
    setSelectedChatUid(friendUid);
  }

  if (!username) return;

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
        <div>
          <span className="friend-card-name">{friendName}</span>
          <span className="friend-card-username">@{username}</span>
        </div>
        <span className="friend-card-title">{friendTitle}</span>
      </div>

      <div className="friend-card-buttons">
        <button
          title="Chat"
          onClick={() => chatFriend(friendUid)}
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