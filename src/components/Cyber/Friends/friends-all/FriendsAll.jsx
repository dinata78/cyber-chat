import { FriendCard } from "./FriendCard";
import { FriendsEmptyUI } from "../FriendsEmptyUI";

export function FriendsAll({ ownUid, friendDatas, statusMap, setSelectedChatUid }) {
  
  return (
    <div id="friends-all">
      <h1>All Friends - {friendDatas.length}</h1>

      {
        friendDatas.length > 0 ?
          <div className="friend-cards overflow-y-support">
            {
              friendDatas.map((friendData, index) => {
                return (
                  <FriendCard 
                    key={index + friendData.uid}
                    ownUid={ownUid}
                    friendUid={friendData.uid}
                    friendDisplayName={friendData.displayName}
                    friendUsername={friendData.username}
                    friendTitle={friendData.title}
                    friendStatus={statusMap[friendData.uid]}
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