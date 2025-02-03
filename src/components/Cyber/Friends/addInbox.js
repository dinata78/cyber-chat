import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { fetchDataFromUid } from "../../../utils";

export async function addInbox(targetUid, type, inboxUid) {
  const userDocRef = doc(db, "users", targetUid);
  const userDocData = await fetchDataFromUid(targetUid);

  await updateDoc(userDocRef, {
    ...userDocData,
    inbox: [
      ...userDocData.inbox,
      {type: type, uid: inboxUid},
    ],
  });
  
}