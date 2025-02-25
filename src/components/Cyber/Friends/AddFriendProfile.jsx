import { useOnlineStatus } from "../../../custom-hooks/useOnlineStatus";
import { capitalizeFirstLetter } from "../../../utils";
import { FriendProfileDataCard } from "./FriendProfileDataCard";

export function AddFriendProfile({ searchedUserData }) {
  
  const { onlineStatus } = useOnlineStatus(searchedUserData.uid);

  return (
    <div id="add-friend-profile">

      <div id="add-friend-profile-left">
        <img src="/empty-pfp.webp" />
        <FriendProfileDataCard 
          label="USERNAME"
          content={searchedUserData.username}
        />
        <FriendProfileDataCard
          label="STATUS"
          content={
            onlineStatus ? 
              capitalizeFirstLetter(onlineStatus)
            : "Loading..."
          }
        />
      </div>

      <div id="add-friend-profile-right">
        <FriendProfileDataCard
          label="DISPLAY NAME"
          content={searchedUserData.displayName}
        />
        <FriendProfileDataCard
          label="TITLE"
          content={searchedUserData.title}
        />
        <FriendProfileDataCard
          label="BIO"
          content={searchedUserData.bio}
        />
      </div>

    </div>
  )
}