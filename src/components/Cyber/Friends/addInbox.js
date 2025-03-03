import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { fetchDataFromUid, groupNames } from "../../../utils";

export async function addInbox(recipientUid, inboxType, inboxUid) {

  const recipientDocRef = doc(db, "users", recipientUid);
  const recipientDocData = await fetchDataFromUid(recipientUid);

  const inboxSubjectDocData = await fetchDataFromUid(inboxUid);
  const displayName = inboxSubjectDocData.displayName;
  const username = inboxSubjectDocData.username;

  let newInbox;

  if (inboxType === "request-sent") {
    newInbox = `You sent a friend request to ${groupNames(displayName, username)}.`; 
  }
  else if (inboxType === "request-received") {
    newInbox = `You received a friend request from ${groupNames(displayName, username)}.`; 
  }
  else if (inboxType === "request-rejected") {
    newInbox = `${groupNames(displayName, username)} rejected your friend request.`
  }
  else if (inboxType === "friend-added") {
    newInbox = `${groupNames(displayName, username)} is now your friend.`;
  }
  else if (inboxType === "friend-removed") {
    newInbox = `${groupNames(displayName, username)} is no longer your friend.`;
  }
  else if (inboxType === "request-cancel") {
    newInbox = `You have cancelled your friend request to ${groupNames(displayName, username)}.`;
  }
  else if (inboxType === "request-cancelled") {
    newInbox = `${groupNames(displayName, username)} has cancelled their friend request to you.`;
  }

  await updateDoc(recipientDocRef, {
    ...recipientDocData,
    inbox: [
      ...recipientDocData.inbox,
      {
        content: newInbox,
        timeCreated: new Date(),
      }
    ],
  });
  
}