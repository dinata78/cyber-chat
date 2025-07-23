import { getIndicatorClass } from "../../../utils";
import { AccountPlusSVG, ChatSVG, SearchSVG } from "../../svg";
import { previewAccount } from "../../AccountPreview";
import { useStatusByUid } from "../../../custom-hooks/useStatusByUid";

export function AddFriendCard({ ownUid, friendUid, friendPfpUrl, friendDisplayName, friendUsername, friendBio, messageFriend, DMIds, isDMIdsLoading, friendUids }) {

  const friendStatus = useStatusByUid(friendUid);

  const handlePreviewAccount = () => previewAccount({
    uid: friendUid,
    pfpUrl: friendPfpUrl,
    displayName: friendDisplayName,
    username: friendUsername,
    bio: friendBio,
    DMIds: DMIds,
    isDMIdsLoading: isDMIdsLoading
  });

  const handleAddFriend = () => {
    return;
  }

  return (
    <div className="friend-card" style={{cursor: "auto"}}>

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

      {
        
      }
      <div className="buttons">
        <button onClick={handlePreviewAccount}>
          <SearchSVG />
        </button>
        {
          friendUid === ownUid ? null
          : [...friendUids, import.meta.env.VITE_DEV_UID].includes(friendUid) ?
            <button onClick={() => messageFriend(ownUid, friendUid, DMIds, isDMIdsLoading)}>
              <ChatSVG />
            </button>
          : <button onClick={handleAddFriend}>
              <AccountPlusSVG />
            </button>
        }
      </div>
      
    </div>
  )
}