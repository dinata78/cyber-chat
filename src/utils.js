import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where, writeBatch } from "firebase/firestore";
import { auth, db, realtimeDb } from "../firebase";
import { removeFriend } from "./components/Chat/_Friends/modifyFriendList";
import { ref, remove } from "firebase/database";

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

export function getOtherUid(conversationId, ownUid) {
  return conversationId.replace(ownUid, "");
}

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
    console.error("Error while deleting image: " + error.message);
    return null;
  }
}

export async function removeMessagesFromDb(conversationUid) {
  try {
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
  catch (error) {
    throw new Error("Error occured while removing user's messages: " + error.message);
  }
}

export async function removeConversationFromDb(uid1, uid2) {
  try {
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
  catch (error) {
    throw new Error(`Error occured while removing conversation (${getConversationId(uid1, uid2)}): ${error.message}`);
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

export function processDate(dateObject) {
  if (!(dateObject instanceof Date)) return null;

  const time = {
    year: dateObject.getFullYear(),
    month: dateObject.getMonth() + 1,
    date: dateObject.getDate(),
    hour: dateObject.getHours(),
    minute: dateObject.getMinutes()
  }

  const year = time.year.toString();
  const month = time.month.toString().padStart(2, "0");
  const date = time.date.toString().padStart(2, "0");;
  const hour = time.hour.toString().padStart(2, "0");;
  const minute = time.minute.toString().padStart(2, "0");;

  return `${year}/${month}/${date} ${hour}:${minute}`;
}

export async function deleteOwnConversations() {
  try {
    const conversationsRef = collection(db, "conversations");
  
    const conversationsQuery = query(
      conversationsRef,
      where("participants", "array-contains", auth.currentUser.uid),
    );
    
    const conversationDocs = await getDocs(conversationsQuery);

    conversationDocs.docs.forEach(async (conversationDoc) => {
      const data = conversationDoc.data();
  
      let conversationParticipants = data.participants;
      conversationParticipants.splice(conversationParticipants.indexOf(auth.currentUser.uid), 1)
    
      if (conversationParticipants.length && conversationParticipants[0] !== import.meta.env.VITE_DEV_UID) {
        await removeFriend(auth.currentUser.uid, conversationParticipants[0]);
      }
  
      await removeConversationFromDb(conversationDoc.id);
    });
  }
  catch (error) {
    throw new Error("Error occured while removing user's conversations: " + error.message);
  }
}

export async function deleteOwnData() {
  try {
    const batch = writeBatch(db);

    const inboxRef = collection(db, "users", auth.currentUser.uid, "inbox");
    const inboxItems = await getDocs(inboxRef);
    
    if (inboxItems.docs.length) {
      inboxItems.docs.forEach(item => {
        batch.delete(item.ref);
      });
    }
  
    const requestsRef = collection(db, "users", auth.currentUser.uid, "requests");
    const requests = await getDocs(requestsRef);
  
    if (requests.docs.length) {
      requests.forEach(request => {
        batch.delete(request.ref);
      });
    }
  
    const ownDocRef = doc(db, "users", auth.currentUser.uid);
  
    await batch.commit();
    await deleteDoc(ownDocRef);
  }
  catch (error) {
    throw new Error("Error occured while deleting user's data: " + error.message);
  }
}

export async function deleteOwnStatusFromRtdb() {
  try {
    const ownStatusRef = ref(realtimeDb, `users/${auth.currentUser.uid}`);

    await remove(ownStatusRef);  
  }
  catch (error) {
    throw new Error("Error occured while deleting user status path from realtime database: " + error.message);
  }
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

export const isContentSearched = (contentArray, searchedValue) => {
  for (const content of contentArray) {
    if (
      content?.toLowerCase().trim()
      .includes(searchedValue.toLowerCase().trim())
    ) {
      return true;
    }
  }

  return false;
}

export const loadImagesAndScrollTo = async (container, { top, behavior }) => {
  const images = container.querySelectorAll("img");

  const promises = Array.from(images).map(image => {
    if (image.complete) return Promise.resolve();
    return new Promise(resolve => {
      image.onload = resolve;
      image.onerror = resolve;
    });
  });

  await Promise.all(promises);

  const scrollTop = top === "max" ? container.scrollHeight - container.clientHeight : top;


  container.scrollTo({
    top: scrollTop,
    behavior: behavior,
  });
}