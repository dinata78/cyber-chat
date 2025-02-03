import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

export function AddFriendButton({ ownUid, searchedUserData, friendList, friendRequestSentList, friendRequestReceivedList }) {

  const addFriend = async (newFriendUid) => {
    if (
      friendRequestSentList.includes(newFriendUid) 
      || friendRequestReceivedList.includes(newFriendUid)
      || friendList.includes(newFriendUid)
      || newFriendUid === ownUid
      ) return;
        
    const userDocRef = doc(db, "users", ownUid);
    const userDoc = await getDoc(userDocRef);
    const userDocData = userDoc.data();

    await updateDoc(userDocRef, {
      ...userDocData,
      friendRequestSent: [...userDocData.friendRequestSent, newFriendUid],
    });

    const friendDocRef = doc(db, "users", newFriendUid);
    const friendDoc = await getDoc(friendDocRef);
    const friendDocData = friendDoc.data();

    await updateDoc(friendDocRef, {
      ...friendDocData,
      friendRequestReceived: [...friendDocData.friendRequestReceived, ownUid],
    });

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
      onClick={() => addFriend(searchedUserData.uid)}
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