import { AddFriendProfileDataCard } from "./AddFriendProfileDataCard";

export function AddFriendProfile({ searchedUserData }) {
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
            searchedUserData.status.charAt(0).toUpperCase()
            + searchedUserData.status.slice(1)
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