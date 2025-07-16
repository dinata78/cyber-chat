import { getIndicatorClass } from "../../../utils";
import { AccountMinusSVG, ChatSVG } from "../../svg";
import { previewAccount } from "../../AccountPreview";
import { useContext } from "react";
import { DMContext } from "../Chat";

export function FriendCard({ ownUid, friendUid, friendPfpUrl, friendDisplayName, friendUsername, friendBio, friendStatus, messageFriend }) {
  const { DMIds, isDMIdsLoading } = useContext(DMContext);

  const handlePreviewAccount = () => previewAccount({
    uid: friendUid,
    pfpUrl: friendPfpUrl,
    displayName: friendDisplayName,
    username: friendUsername,
    bio: friendBio,
    DMIds: DMIds,
    isDMIdsLoading: isDMIdsLoading
  });

  const handleRemoveFriend = async () => {
    return;
  }

  return (
    <div
      tabIndex={0}
      className="friend-card"
      onClick={handlePreviewAccount}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          handlePreviewAccount();
        }
      }}
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            messageFriend(ownUid, friendUid, DMIds, isDMIdsLoading);
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <ChatSVG />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveFriend();
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <AccountMinusSVG />
        </button>
      </div>
      
    </div>
  )
}