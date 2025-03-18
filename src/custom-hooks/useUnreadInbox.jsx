import { collection, getDocs, query, where, writeBatch } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useUnreadInbox(uid, inboxItemsLength) {
  const [unreadInboxIds, setUnreadInboxIds] = useState([]);
  
  useEffect(() => {
    const fetchSetAndClearUnread = async () => {
      if (!uid) return;

      const unreadInboxQuery = query(
        collection(db, "users", uid, "inbox"),
        where("isUnread", "==", true),
      )
  
      const unreadInboxDocs = await getDocs(unreadInboxQuery);
      const unreadInboxIds = unreadInboxDocs.docs.map(doc => doc.id);

      setUnreadInboxIds(unreadInboxIds);

      if (unreadInboxIds.length) {
        const batch = writeBatch(db);

        unreadInboxDocs.docs.forEach((item) => {
          batch.update(item.ref, {
            ...item.data(),
            isUnread: false,
          });
        });
  
        await batch.commit();  
      }
    }

    fetchSetAndClearUnread();
  }, [uid, inboxItemsLength]);

  return { unreadInboxIds }

}