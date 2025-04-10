import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where, writeBatch } from "firebase/firestore";
import { db, realtimeDb } from "../firebase";
import { removeFriend } from "./components/Cyber/Friends/modifyFriendList";
import { get, onDisconnect, ref, remove, update } from "firebase/database";

export function getConversationId(uid1, uid2) {
  if (typeof uid1 !== "string" || typeof uid2 !== "string") return null;
  if (uid1 === "globalChat" || uid2 === "globalChat") return "globalChat";
  if (uid1 === uid2) return uid1;
  if (uid1.length !== uid2.length) return null;
  
  let i = 0;
  while (true) {
    const uid1Charcode = uid1.charCodeAt(i);
    const uid2Charcode = uid2.charCodeAt(i);

    if (uid1Charcode < uid2Charcode) return uid1 + uid2;
    else if (uid1Charcode > uid2Charcode) return uid2 + uid1;
    else i++;
  }
};

export async function addNewConversationToDb(uid1, uid2) {
  if (uid2 === undefined) {
    const newConversationDocRef = doc(db, "conversations", uid1);

    await setDoc(newConversationDocRef, {
      participants: [uid1],
    })
  }

  else {
    const newConversationId = getConversationId(uid1, uid2);
    const newConversationDocRef = doc(db, "conversations", newConversationId);
  
    await setDoc(newConversationDocRef, {
      participants: [uid1, uid2],
    });  
  }
  
}

export const deleteImageFromDb = async (url) => {
  try {
    const formData = new FormData();
    formData.append("imageUrl", url);
  
    const response = await fetch(
      "https://cyberchat.mediastorage.workers.dev/image/delete",
      {
        method: "DELETE",
        body: formData,
      }
    );
  
    const data = await response.json();
    return data.success;
  }
  catch (error) {
    console.error("Error while deleting image: " + error);
    return null;
  }
}

export async function removeMessagesFromDb(conversationUid) {
  const batch = writeBatch(db);
  let imageUrls = [];
  
  const messagesCollectionRef = collection(db, "conversations", conversationUid, "messages");
  
  const messagesDocs = await getDocs(messagesCollectionRef);

  messagesDocs.docs.forEach((doc) => {
    if (doc.data().type === "image") {
      imageUrls.push(doc.data().content);
    }

    batch.delete(doc.ref);
  });

  await batch.commit();

  if (imageUrls.length) {
    await Promise.all(
      imageUrls.map(url => deleteImageFromDb(url))
    );
  }
}

export async function removeConversationFromDb(uid1, uid2) {
  if (uid2 === undefined) {
    const conversationDocRef = doc(db, "conversations", uid1);
    
    await removeMessagesFromDb(uid1);
    await deleteDoc(conversationDocRef);
  }
  else {
    const conversationDocId = getConversationId(uid1, uid2);
    const conversationDocRef = doc(db, "conversations", conversationDocId);

    await removeMessagesFromDb(conversationDocId);
    await deleteDoc(conversationDocRef);
  }
}

export async function fetchDataFromUid(uid) {
  const docRef = doc(db, "users", uid);
  const response = await getDoc(docRef);
  const data = response.data();
  
  return data;
}

export function getIndicatorClass(status) {
  if (status === "online") return "indicator online";
  else if (status === "offline") return "indicator offline";
  else if (status === "hidden") return "indicator hidden";
}

export function capitalizeFirstLetter(str) {
  return (
    str?.charAt(0).toUpperCase()
    + str?.slice(1)
  )
}

export function normalizeSpaces(str) {
  return str?.replace(/\s+/g, ' ').trim();
}

export function groupNames(displayName, username) {
  return `*${displayName} (@${username})*`;
}

export function returnTwoDigitNumInString(num) {
  const numInString = num?.toString();

  if (numInString.length === 1) {
    return `0${num}`;
  }
  else {
    return numInString;
  }
}

export function processDate(dateObject) {
  const time = {year: dateObject.getFullYear(), month: dateObject.getMonth() + 1, date: dateObject.getDate(), hour: dateObject.getHours(), minute: dateObject.getMinutes()}

  const year = time.year.toString();
  const month = returnTwoDigitNumInString(time.month);
  const date = returnTwoDigitNumInString(time.date);
  const hour = returnTwoDigitNumInString(time.hour);
  const minute = returnTwoDigitNumInString(time.minute);

  return `${year}/${month}/${date} ${hour}:${minute}`;
}

export async function deleteUserConversation(uid) {
  const conversationsRef = collection(db, "conversations");
  
  const userConversationsQuery = query(
    conversationsRef,
    where("participants", "array-contains", uid),
  );

  const userConversationDocs = await getDocs(userConversationsQuery);

  userConversationDocs.docs.forEach(async (conversationDoc) => {
    const data = conversationDoc.data();

    let conversationParticipants = data.participants;
    conversationParticipants.splice(conversationParticipants.indexOf(uid), 1)
  
    if (conversationParticipants.length && conversationParticipants[0] !== import.meta.env.VITE_DEV_UID) {
      await removeFriend(uid, conversationParticipants[0]);
    }

    await removeConversationFromDb(conversationDoc.id);
  });
}

export async function deleteUserData(uid) {
  const batch = writeBatch(db);

  const userInboxRef = collection(db, "users", uid, "inbox");
  const userInboxItems = await getDocs(userInboxRef);
  
  if (userInboxItems.docs.length) {
    userInboxItems.docs.forEach(item => {
      batch.delete(item.ref);
    });
  }

  const userRequestsRef = collection(db, "users", uid, "requests");
  const userRequests = await getDocs(userRequestsRef);

  if (userRequests.docs.length) {
    userRequests.forEach(request => {
      batch.delete(request.ref);
    });
  }

  const userDocRef = doc(db, "users", uid);

  await batch.commit();
  await deleteDoc(userDocRef);
}

export async function deleteUserStatusFromDb(uid) {
  const userDbStatusRef = ref(realtimeDb, `users/${uid}`);

  await remove(userDbStatusRef);
}

export function setCursorPosition(elementRef, offset) {
  const selection = window.getSelection();
  const newRange = document.createRange();

  if (offset === "end") {
    offset = elementRef.current.childNodes[0]?.length;
  }

  if (elementRef.current.childNodes.length > 0) {
    newRange.setStart(
      elementRef.current.childNodes[0],
      Math.min(offset, elementRef.current.childNodes[0].length)
    );
    newRange.setEnd(
      elementRef.current.childNodes[0],
      Math.min(offset, elementRef.current.childNodes[0].length)
    );
    selection.removeAllRanges();
    selection.addRange(newRange);  
  }
  else {
    elementRef.current.focus();
  }

}