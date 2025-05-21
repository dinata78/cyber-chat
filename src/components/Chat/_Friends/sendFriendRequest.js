import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../../firebase";

export async function sendFriendRequest(ownUid, newFriendUid) { 
  const ownRequests = collection(db, "users", ownUid, "requests");
  const newFriendRequests = collection(db, "users", newFriendUid, "requests");
 
  await Promise.all([
    addDoc(ownRequests, {
      type: "sent",
      uid: newFriendUid,
      timeCreated: new Date(),
      isUnread: true,
    }),
    
    addDoc(newFriendRequests, {
      type: "received",
      uid: ownUid,
      timeCreated: new Date(),
      isUnread: true,
    })
  ]);

}