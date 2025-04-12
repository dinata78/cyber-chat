import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../../firebase";
import { fetchDataFromUid } from "../../../utils";

export async function addInbox(targetInboxUid, inboxType, contentUid) {

  const targetInboxRef = collection(db, "users", targetInboxUid, "inbox");

  const contentDocData = await fetchDataFromUid(contentUid);
  const displayName = contentDocData.displayName;
  const username = contentDocData.username;

  let newInboxContent;

  if (inboxType === "request-sent") {
    newInboxContent = `You sent a friend request to *${displayName} (@${username})*.`; 
  }
  else if (inboxType === "request-received") {
    newInboxContent = `You received a friend request from *${displayName} (@${username})*.`; 
  }
  else if (inboxType === "request-rejected") {
    newInboxContent = `*${displayName} (@${username})* rejected your friend request.`
  }
  else if (inboxType === "friend-added") {
    newInboxContent = `*${displayName} (@${username})* is now your friend.`;
  }
  else if (inboxType === "friend-removed") {
    newInboxContent = `*${displayName} (@${username})* is no longer your friend.`;
  }
  else if (inboxType === "request-cancel") {
    newInboxContent = `You have cancelled your friend request to *${displayName} (@${username})*.`;
  }
  else if (inboxType === "request-cancelled") {
    newInboxContent = `*${displayName} (@${username})* has cancelled their friend request to you.`;
  }

  await addDoc(targetInboxRef, {
    content: newInboxContent,
    timeCreated: new Date(),
    isUnread: true,
  });
  
}