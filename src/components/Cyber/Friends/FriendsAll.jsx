import { FriendCard } from "./FriendCard";
import { FriendsEmptyUI } from "./FriendsEmptyUI";

export function FriendsAll({ ownUid, friendDataList, setSelectedChatUid }) {
  
  return (
    <div id="friends-all">
      <h1>All Friends - {friendDataList.length}</h1>

      {
        friendDataList.length > 0 ?
          <div className="friend-cards overflow-y-support">
            {
              friendDataList.map((friendData, index) => {
                return (
                  <FriendCard 
                    key={index + friendData.uid}
                    ownUid={ownUid}
                    friendUid={friendData.uid}
                    friendName={friendData.displayName}
                    friendTitle={friendData.title}
                    setSelectedChatUid={setSelectedChatUid}
                  />
                )
              })
            }
          </div>
        : <FriendsEmptyUI type="all" />      
      }
    </div>
  )
}