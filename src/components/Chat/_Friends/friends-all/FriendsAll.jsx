import { FriendCard } from "../../Friends/FriendCard";
import { FriendsEmptyUI } from "../FriendsEmptyUI";
import { isContentSearched } from "../../../../utils";

export function FriendsAll({ ownUid, friendDatas, statusMap, setSelectedChatUid, searchedInput }) {

  const filteredFriendDatas = friendDatas.filter(friendData => {
    return isContentSearched([friendData.displayName, friendData.username, friendData.title], searchedInput);
  });
  
  return (
    <div id="friends-all">
      <h1>All Friends - {friendDatas.length}</h1>

      {
        filteredFriendDatas.length > 0 ?
          <div className="friend-cards overflow-y-support">
            {
              filteredFriendDatas.map((friendData, index) => {
                return (
                  <FriendCard 
                    key={index + friendData.uid}
                    ownUid={ownUid}
                    friendUid={friendData.uid}
                    friendDisplayName={friendData.displayName}
                    friendUsername={friendData.username}
                    friendTitle={friendData.title}
                    friendStatus={statusMap[friendData.uid]}
                    friendPfpUrl={friendData.pfpUrl}
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