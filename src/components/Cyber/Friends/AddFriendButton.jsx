import { addInbox } from "./addInbox";
import { requestFriend } from "./requestFriend";

export function AddFriendButton({ ownUid, searchedUserData, friendList, friendRequestSentList, friendRequestReceivedList }) {

  const addFriendOnClick = async (newFriendUid) => {
    if (
      friendRequestSentList.includes(newFriendUid) 
      || friendRequestReceivedList.includes(newFriendUid)
      || friendList.includes(newFriendUid)
      || newFriendUid === ownUid
      ) return;
    
    await requestFriend(ownUid, newFriendUid);
    await addInbox(ownUid, "request-sent", newFriendUid);
    await addInbox(newFriendUid, "request-received", ownUid);
    
  }
  
  return (
    <button id="add-friend-button" 
      className={ 
        friendRequestSentList.includes(searchedUserData.uid) ? "sent no-effect"
        : friendRequestReceivedList.includes(searchedUserData.uid) ? "received no-effect"
        : friendList.includes(searchedUserData.uid) ? "is-friend no-effect"
        : searchedUserData.uid === ownUid ? "self no-effect"
        : null
      }
      onClick={() => addFriendOnClick(searchedUserData.uid)}
    >
      {
        friendRequestSentList.includes(searchedUserData.uid) ?
          "FRIEND REQUEST SENT"
        : friendRequestReceivedList.includes(searchedUserData.uid) ?
          "USER SENT YOU A FRIEND REQUEST"
        : searchedUserData.uid === ownUid ?
          "CAN'T ADD YOURSELF"
        : friendList.includes(searchedUserData.uid) ?
          "USER IS ALREADY YOUR FRIEND"
        : "SEND FRIEND REQUEST"
      }
    </button>
  )
}