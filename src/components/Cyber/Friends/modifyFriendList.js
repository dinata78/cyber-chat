import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { addNewConversationToDb, fetchDataFromUid, removeConversationFromDb } from "../../../utils";

export async function addFriend(uid1, uid2) {
  
  const uid1DocRef = doc(db, "users", uid1);
  const uid1DocData = await fetchDataFromUid(uid1);

  const uid2DocRef = doc(db, "users", uid2);
  const uid2DocData = await fetchDataFromUid(uid2);

  await Promise.all([
    updateDoc(uid1DocRef, {
      ...uid1DocData,
      friendList: [
        ...uid1DocData.friendList,
        uid2,
      ],
    }),
  
    updateDoc(uid2DocRef, {
      ...uid2DocData,
      friendList: [
        ...uid2DocData.friendList,
        uid1,
      ],
    }),
  
    addNewConversationToDb(uid1, uid2),
  ]);
  
}

export async function removeFriend(uid1, uid2) {
  
  const uid1DocRef = doc(db, "users", uid1);
  const uid1DocData = await fetchDataFromUid(uid1);

  const uid2DocRef = doc(db, "users", uid2);
  const uid2DocData = await fetchDataFromUid(uid2);

  const uid1FriendList = uid1DocData.friendList;
  const uid2FriendList = uid2DocData.friendList;

  uid1FriendList.splice(
    uid1FriendList.indexOf(uid2), 1
  );

  uid2FriendList.splice(
    uid2FriendList.indexOf(uid1), 1
  )

  await Promise.all([
    updateDoc(uid1DocRef, {
      ...uid1DocData,
      friendList: uid1FriendList,
    }),
  
    updateDoc(uid2DocRef, {
      ...uid2DocData,
      friendList: uid2FriendList,
    }),
  
    removeConversationFromDb(uid1, uid2),
  ]);
  
}

