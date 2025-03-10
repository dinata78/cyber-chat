import { addDoc, collection, getDocs, query, where, writeBatch } from "firebase/firestore";
import { db } from "../../../../firebase";
import { addNewConversationToDb, removeConversationFromDb } from "../../../utils";

export async function addFriend(uid1, uid2) {
  const uid1FriendListRef = collection(db, "users", uid1, "friendList");

  const uid2FriendListRef = collection(db, "users", uid2, "friendList");

  await Promise.all([
    addDoc(uid1FriendListRef, {
      uid: uid2,
    }),

    addDoc(uid2FriendListRef, {
      uid: uid1,
    }),

    addNewConversationToDb(uid1, uid2),  
  ]);
}

export async function removeFriend(uid1, uid2) {
  const batch = writeBatch(db);

  const uid1FriendListQuery = query(
    collection(db, "users", uid1, "friendList"),
    where("uid", "==", uid2),
  );
  
  const uid2FriendListQuery = query(
    collection(db, "users", uid2, "friendList"),
    where("uid", "==", uid1),
  );

  const uid1FriendList = await getDocs(uid1FriendListQuery);
  const uid2FriendList = await getDocs(uid2FriendListQuery);

  uid1FriendList.docs.forEach(doc => batch.delete(doc.ref));
  uid2FriendList.docs.forEach(doc => batch.delete(doc.ref));

  await Promise.all([
    batch.commit(),
    removeConversationFromDb(uid1, uid2),  
  ]);
}