
export function AddFriendProfile({ searchedUserData }) {
  return (
    <div id="add-friend-profile">
      <div id="add-friend-profile-pfp">
        <img src="/empty-pfp.webp" />
        <span>{"@" + searchedUserData.username}</span>
      </div>
      <div id="add-friend-profile-data">
        <span className="name">{searchedUserData.displayName}</span>
        <span className="status">{searchedUserData.status}</span>
        <span className="title">{searchedUserData.title}</span>
        <span className="bio">{searchedUserData.bio}</span>
      </div>
    </div>
  )
}