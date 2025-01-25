import { FriendCard } from "./FriendCard";

export function FriendsAll({ friendDataList }) {
  
  return (
    <div id="friends-all">
      <h1>All Friends - {friendDataList.length}</h1>
      <div className="friend-cards overflow-y-support">
        {
          friendDataList.map((friendData, index) => {
            return (
              <FriendCard 
                key={index + friendData.uid}
                friendUid={friendData.uid}
                friendName={friendData.name}
                friendTitle={friendData.title}
              />
            )
          })
        }
      </div>
    </div>
  )
}