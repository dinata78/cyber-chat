import { FriendCard } from "./FriendCard";
import { FriendsEmptyUI } from "./FriendsEmptyUI";

export function FriendsAll({ ownUid, friendListDatas, setSelectedChatUid }) {
  
  return (
    <div id="friends-all">
      <h1>All Friends - {friendListDatas.length}</h1>

      {
        friendListDatas.length > 0 ?
          <div className="friend-cards overflow-y-support">
            {
              friendListDatas.map((friendData, index) => {
                return (
                  <FriendCard 
                    key={index + friendData.uid}
                    ownUid={ownUid}
                    friendUid={friendData.uid}
                    friendDisplayName={friendData.displayName}
                    friendUsername={friendData.username}
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