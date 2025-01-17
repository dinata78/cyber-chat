import { FriendCard } from "./FriendCard";

export function FriendsAll({friendDataList}) {

  return (
    <div id="friends-all">
      <h1>All Friends - {friendDataList.length}</h1>
      <div className="friend-cards">
        {
          friendDataList.map((friendData, index) => {
            return <FriendCard key={index + friendData.name} friendName={friendData.name} friendTitle={friendData.title} friendStatus={friendData.status} />
          })
        }
      </div>
    </div>
  )
}