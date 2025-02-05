import { FriendCard } from "./FriendCard";

export function FriendsAll({ ownUid, friendDataList, setSelectedChatUid }) {
  
  return (
    <div id="friends-all">
      <h1>All Friends - {friendDataList.length}</h1>
      <div className="friend-cards overflow-y-support">
        {
          friendDataList.map((friendData, index) => {
            return (
              <FriendCard 
                key={index + friendData.uid}
                ownUid={ownUid}
                friendUid={friendData.uid}
                friendName={friendData.name}
                friendTitle={friendData.title}
                setSelectedChatUid={setSelectedChatUid}
              />
            )
          })
        }
      </div>
    </div>
  )
}