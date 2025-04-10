import { addInbox } from "../addInbox";
import { sendFriendRequest } from "../sendFriendRequest"

export function AddFriendButton({ ownUid, searchedUserData, friendUids, requests }) {

  const requestSentList = requests.filter(request => request.type === "sent");
  const requestReceivedList = requests.filter(request => request.type === "received");

  const requestSentUidList = requestSentList.map(request => request.uid);
  const requestReceivedUidList = requestReceivedList.map((request) => request.uid);

  const addFriendOnClick = async (newFriendUid) => {
    if (
      requestSentUidList.includes(newFriendUid) 
      || requestReceivedUidList.includes(newFriendUid)
      || friendUids.includes(newFriendUid)
      || newFriendUid === ownUid
      || newFriendUid === import.meta.env.VITE_DEV_UID
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
        : friendUids.includes(searchedUserData.uid) ? "is-friend no-effect"
        : searchedUserData.uid === ownUid ? "self no-effect"
        : searchedUserData.uid === import.meta.env.VITE_DEV_UID ? "dev no-effect"
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
        : friendUids.includes(searchedUserData.uid) ?
          "USER IS ALREADY YOUR FRIEND"
        : searchedUserData.uid === import.meta.env.VITE_DEV_UID ?
          "DEVELOPER OF CYBERCHAT"
        : "SEND FRIEND REQUEST"
      }
    </button>
  )
}