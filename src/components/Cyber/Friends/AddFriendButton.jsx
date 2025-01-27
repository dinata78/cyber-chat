import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

export function AddFriendButton({ ownUid, searchedUserData, friendRequestSentList, friendRequestReceivedList }) {

  const addFriend = async (newFriendUid) => {
    if (
      friendRequestSentList.includes(newFriendUid) 
      || friendRequestReceivedList.includes(newFriendUid)
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
        (friendRequestSentList.includes(searchedUserData.uid)) ? "sent"
        : (friendRequestReceivedList.includes(searchedUserData.uid)) ? "received"
        : searchedUserData.uid === ownUid ? "self"
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
        : "SEND FRIEND REQUEST"
      }
    </button>
  )
}