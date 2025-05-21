import { getIndicatorClass } from "../../../utils";
import { addInbox } from "../_Friends/addInbox";
import { removeFriend } from "../_Friends/modifyFriendList";
import { AccountMinusSVG, ChatSVG } from "../../svg";

export function FriendCard({ ownUid, friendUid, friendDisplayName, friendUsername, friendStatus, friendPfpUrl, setSelectedChatUid, setIsSidebarVisible }) {

  const chatFriend = (friendUid) => {
    setSelectedChatUid(friendUid);
    setIsSidebarVisible(false);
  }

  const handleRemoveFriend = async () => {
    setIsPopUpVisible(false);

    await removeFriend(ownUid, friendUid);
    await addInbox(ownUid, "friend-removed", friendUid);
    await addInbox(friendUid, "friend-removed", ownUid);
  }

  return (
    <div className="friend-card" tabIndex={0}>

      <div className="pfp">
        <img src={friendPfpUrl || "/empty-pfp.webp"} />
        <div className={getIndicatorClass(friendStatus)}></div>
      </div>

      <div className="name">
        <span className="display-name">{friendDisplayName}</span>
        <span className="username">@{friendUsername}</span>
      </div>

      <div className="buttons">
        <button onClick={() => chatFriend(friendUid)}>
          <ChatSVG />
        </button>
        <button onClick={handleRemoveFriend}>
          <AccountMinusSVG />
        </button>
      </div>
      
    </div>
  )
}