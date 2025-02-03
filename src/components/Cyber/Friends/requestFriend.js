import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

export async function requestFriend(ownUid, newFriendUid) {
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