import { query } from "firebase/database";
import { getConversationId } from "../../../utils";
import { collection, doc, getDoc, limit, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../../../../firebase";


export function onChatCardClick(
  name, 
  title, 
  uid, 
  ownUid, 
  setCurrentChatData,
  setCurrentChatContent,
  usernamesMap, 
  setUsernamesMap,
  unsubscribeSnapshot,
  setSelectedChatUid
) {

  if (!ownUid) return;

  setSelectedChatUid(uid);

  setCurrentChatData({
    name: name,
    title: title,
    uid: uid, 
  });

  if (unsubscribeSnapshot.current) {
    unsubscribeSnapshot.current();
  }

  const conversationId = getConversationId(ownUid, uid);

  const messageQuery = query(
    collection(db, "conversations", conversationId, "messages"),
    orderBy("timeCreated", "desc"),
    limit(50),
  );

  const unsubscribe = onSnapshot(messageQuery, async (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({...doc.data()}));

    const uniqueSenderIds = Array.from(new Set(messages.map((message) => message.senderId)));
    const missingUsernameIds = uniqueSenderIds.filter((id) => !usernamesMap[id]);

    if (missingUsernameIds.length > 0) {
      const fetchedNames = {};
      for (const senderId of missingUsernameIds) {
        const userDoc = await getDoc(doc(db, "users", senderId));

        if (userDoc.exists()) {
          fetchedNames[senderId] = userDoc.data().name;
        }
      }
      setUsernamesMap((prev) => ({...prev, ...fetchedNames}));
    }

    setCurrentChatContent(messages.reverse());
  });

  unsubscribeSnapshot.current = unsubscribe;
}