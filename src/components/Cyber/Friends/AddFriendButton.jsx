import { addInbox } from "./addInbox";
import { sendFriendRequest } from "./sendFriendRequest";

export function AddFriendButton({ ownUid, searchedUserData, friendList, requests }) {

  const requestSentList = requests.filter(request => request.type === "sent");
  const requestReceivedList = requests.filter(request => request.type === "received");

  const requestSentUidList = requestSentList.map(request => request.uid);
  const requestReceivedUidList = requestReceivedList.map((request) => request.uid);

  const addFriendOnClick = async (newFriendUid) => {
    if (
      requestSentUidList.includes(newFriendUid) 
      || requestReceivedUidList.includes(newFriendUid)
      || friendList.includes(newFriendUid)
      || newFriendUid === ownUid
      || newFriendUid === "28qZ6LQQi3g76LLRd20HXrkQIjh1"
      ) return;
    
    await sendFriendRequest(ownUid, newFriendUid);
    await addInbox(ownUid, "request-sent", newFriendUid);
    await addInbox(newFriendUid, "request-received", ownUid);
    
  }
  
  return (
    <button id="add-friend-button" 
      className={ 
        requestSentUidList.includes(searchedUserData.uid) ? "sent no-effect"
        : requestReceivedUidList.includes(searchedUserData.uid) ? "received no-effect"
        : friendList.includes(searchedUserData.uid) ? "is-friend no-effect"
        : searchedUserData.uid === ownUid ? "self no-effect"
        : searchedUserData.uid === "28qZ6LQQi3g76LLRd20HXrkQIjh1" ? "dev no-effect"
        : null
      }
      onClick={() => addFriendOnClick(searchedUserData.uid)}
    >
      {
        requestSentUidList.includes(searchedUserData.uid) ?
          "FRIEND REQUEST SENT"
        : requestReceivedUidList.includes(searchedUserData.uid) ?
          "USER SENT YOU A FRIEND REQUEST"
        : searchedUserData.uid === ownUid ?
          "CAN'T ADD YOURSELF"
        : friendList.includes(searchedUserData.uid) ?
          "USER IS ALREADY YOUR FRIEND"
        : searchedUserData.uid === "28qZ6LQQi3g76LLRd20HXrkQIjh1" ?
          "DEVELOPER OF CYBERCHAT"
        : "SEND FRIEND REQUEST"
      }
    </button>
  )
}