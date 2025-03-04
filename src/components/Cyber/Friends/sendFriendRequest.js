import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { fetchDataFromUid } from "../../../utils";

export async function sendFriendRequest(ownUid, newFriendUid) {
  const ownDocRef = doc(db, "users", ownUid);
  const ownDocData = await fetchDataFromUid(ownUid);

  const friendDocRef = doc(db, "users", newFriendUid);
  const friendDocData = await fetchDataFromUid(newFriendUid);

  await updateDoc(ownDocRef, {
    ...ownDocData,
    friendRequest: [
      ...ownDocData.friendRequest,
      {type: "sent", timeCreated: new Date(), uid: newFriendUid}
    ],
  });

  await updateDoc(friendDocRef, {
    ...friendDocData,
    friendRequest: [
      ...friendDocData.friendRequest,
      {type: "received", timeCreated: new Date(), uid: ownUid}
    ],
  });
}