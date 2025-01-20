import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../firebase";

export function AddFriendButton({ searchedUserData, friendRequestSentList }) {

  const addFriend = async (newFriendUid) => {
    if (friendRequestSentList.includes(newFriendUid)) return;
        
    const userDocRef = doc(db, "users", auth.currentUser.uid);
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
      friendRequestReceived: [...friendDocData.friendRequestReceived, auth.currentUser.uid],
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