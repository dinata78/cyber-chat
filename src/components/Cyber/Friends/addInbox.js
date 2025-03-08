import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../../firebase";
import { fetchDataFromUid, groupNames } from "../../../utils";

export async function addInbox(targetInboxUid, inboxType, contentUid) {

  const targetInboxRef = collection(db, "users", targetInboxUid, "inbox");

  const contentDocData = await fetchDataFromUid(contentUid);
  const displayName = contentDocData.displayName;
  const username = contentDocData.username;

  let newInboxContent;

  if (inboxType === "request-sent") {
    newInboxContent = `You sent a friend request to ${groupNames(displayName, username)}.`; 
  }
  else if (inboxType === "request-received") {
    newInboxContent = `You received a friend request from ${groupNames(displayName, username)}.`; 
  }
  else if (inboxType === "request-rejected") {
    newInboxContent = `${groupNames(displayName, username)} rejected your friend request.`
  }
  else if (inboxType === "friend-added") {
    newInboxContent = `${groupNames(displayName, username)} is now your friend.`;
  }
  else if (inboxType === "friend-removed") {
    newInboxContent = `${groupNames(displayName, username)} is no longer your friend.`;
  }
  else if (inboxType === "request-cancel") {
    newInboxContent = `You have cancelled your friend request to ${groupNames(displayName, username)}.`;
  }
  else if (inboxType === "request-cancelled") {
    newInboxContent = `${groupNames(displayName, username)} has cancelled their friend request to you.`;
  }

  await addDoc(targetInboxRef, {
    content: newInboxContent,
    timeCreated: new Date(),
    isUnread: true,
  });
  
}