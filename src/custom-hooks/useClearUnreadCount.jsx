import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../../firebase";

export function useClearUnreadCount(ownUid, conversationId) {

  const clearUnreadCount = async (id) => {
    const conversationDocRef = doc(db, "conversations", id);
    const conversationDoc = await getDoc(conversationDocRef);
    const unreadCount = conversationDoc.data().unreadCount;
    const newUnreadCount = {...unreadCount};
    newUnreadCount[ownUid] = 0;

    await updateDoc(conversationDocRef, {
      unreadCount: {...newUnreadCount},
    });
  }

  useEffect(() => {
    if (!ownUid) return;
    if (!conversationId) return;

    const conversationRef = doc(db, "conversations", conversationId);

    const unsubscribe = onSnapshot(conversationRef, (snapshot) => {
      if (snapshot.data().unreadCount?.[ownUid] > 0) {
        clearUnreadCount(conversationId);
      }
    });

    return () => unsubscribe();

  }, [ownUid, conversationId]);

}