import { useTrackOnlineStatus } from "../../../custom-hooks/useTrackOnlineStatus";
import { AddFriendProfileDataCard } from "./AddFriendProfileDataCard";

export function AddFriendProfile({ searchedUserData }) {
  const { onlineStatus } = useTrackOnlineStatus(searchedUserData.uid);
  
  return (
    <div id="add-friend-profile">

      <div id="add-friend-profile-left">
        <img src="/empty-pfp.webp" />
        <AddFriendProfileDataCard 
          label="USERNAME"
          content={searchedUserData.username}
        />
        <AddFriendProfileDataCard
          label="STATUS"
          content={
            onlineStatus ? 
              onlineStatus.charAt(0).toUpperCase() 
              + onlineStatus.slice(1) 
            : "Loading..."
          }
        />
      </div>

      <div id="add-friend-profile-right">
        <AddFriendProfileDataCard
          label="DISPLAY NAME"
          content={searchedUserData.displayName}
        />
        <AddFriendProfileDataCard
          label="TITLE"
          content={searchedUserData.title}
        />
        <AddFriendProfileDataCard
          label="BIO"
          content={searchedUserData.bio}
        />
      </div>

    </div>
  )
}