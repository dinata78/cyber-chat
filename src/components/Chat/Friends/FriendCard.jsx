import { getIndicatorClass } from "../../../utils";
import { AccountMinusSVG, ChatSVG } from "../../svg";
import { previewAccount } from "../../AccountPreview";

export function FriendCard({ ownUid, friendUid, friendPfpUrl, friendDisplayName, friendUsername, friendBio, friendStatus, messageFriend }) {

  const handleRemoveFriend = async () => {

  }

  return (
    <div
      tabIndex={0}
      className="friend-card"
      onClick={() => previewAccount({
        uid: friendUid,
        pfpUrl: friendPfpUrl,
        displayName: friendDisplayName,
        username: friendUsername,
        bio: friendBio
      })}
    >

      <div className="pfp">
        <img src={friendPfpUrl || "/empty-pfp.webp"} />
        <div className={getIndicatorClass(friendStatus)}></div>
      </div>

      <div className="name">
        <span className="display-name text-overflow-support">
          {friendDisplayName}
        </span>
        <span className="username text-overflow-support">
          @{friendUsername}
        </span>
      </div>

      <div className="buttons">
        <button onClick={(e) => {
          e.stopPropagation();
          messageFriend(ownUid, friendUid);
        }}>
          <ChatSVG />
        </button>
        <button onClick={(e) => {
          e.stopPropagation();
          handleRemoveFriend();
        }}>
          <AccountMinusSVG />
        </button>
      </div>
      
    </div>
  )
}