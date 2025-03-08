import { collection, getDocs, query, where, writeBatch } from "firebase/firestore";
import { db } from "../../../../firebase";
import { addInbox } from "./addInbox";
import { addFriend } from "./modifyFriendList";

export async function handleRequest(type, ownUid, senderUid) {
  const batch = writeBatch(db);

  const ownCurrentRequestQuery = query(
    collection(db, "users", ownUid, "requests"),
    where("type", "==", "received"),
    where("uid", "==", senderUid),
  );

  const senderCurrentRequestQuery = query(
    collection(db, "users", senderUid, "requests"),
    where("type", "==", "sent"),
    where("uid", "==", ownUid),
  );

  const ownCurrentRequestDocs = await getDocs(ownCurrentRequestQuery);

  const senderCurrentRequestDocs = await getDocs(senderCurrentRequestQuery);

  batch.delete(ownCurrentRequestDocs.docs[0].ref);
  batch.delete(senderCurrentRequestDocs.docs[0].ref);

  batch.commit();

  if (type === "accept") {
    await Promise.all([
      addFriend(ownUid, senderUid),
      addInbox(ownUid, "friend-added", senderUid),
      addInbox(senderUid, "friend-added", ownUid),
    ]);
    
  }
  else if (type === "reject") {
    await addInbox(senderUid, "request-rejected", ownUid);
  }
}

export async function cancelRequest(ownUid, receiverUid) {
  const batch = writeBatch(db);

  const ownCurrentRequestQuery = query(
    collection(db, "users", ownUid, "requests"),
    where("type", "==", "sent"),
    where("uid", "==", receiverUid),
  )

  const receiverCurrentRequestQuery = query(
    collection(db, "users", receiverUid, "requests"),
    where("type", "==", "received"),
    where("uid", "==", ownUid),
  )

  const ownCurrentRequestDocs = await getDocs(ownCurrentRequestQuery);

  const receiverCurrentRequestDocs = await getDocs(receiverCurrentRequestQuery);

  batch.delete(ownCurrentRequestDocs.docs[0].ref);
  batch.delete(receiverCurrentRequestDocs.docs[0].ref);

  batch.commit();

  await addInbox(ownUid, "request-cancel", receiverUid);
  await addInbox(receiverUid, "request-cancelled", ownUid);
}