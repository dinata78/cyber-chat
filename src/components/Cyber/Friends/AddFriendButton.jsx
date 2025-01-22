import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

export function AddFriendButton({ ownUid, searchedUserData, friendRequestSentList }) {

  const addFriend = async (newFriendUid) => {
    if (friendRequestSentList.includes(newFriendUid)) return;
        
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
      className={friendRequestSentList.includes(searchedUserData.uid) ? "sent" : null}
      onClick={() => addFriend(searchedUserData.uid)}
    >
      {
        friendRequestSentList.includes(searchedUserData.uid) ?
        "FRIEND REQUEST SENT"
        : "SEND FRIEND REQUEST"
      }
    </button>
  )
}