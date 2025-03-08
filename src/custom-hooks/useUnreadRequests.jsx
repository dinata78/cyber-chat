import { collection, getDocs, query, where, writeBatch } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useUnreadRequests(uid, requestsLength) {
  const [unreadRequestIds, setUnreadRequestIds] = useState([]);
  
  useEffect(() => {
    const fetchSetAndClearUnread = async () => {
      if (!uid) return;

      const unreadRequestsQuery = query(
        collection(db, "users", uid, "requests"),
        where("isUnread", "==", true),
      );
  
      const unreadRequestsDocs = await getDocs(unreadRequestsQuery);
      const unreadRequestIds = unreadRequestsDocs.docs.map(doc => doc.id);

      setUnreadRequestIds(unreadRequestIds);

      const batch = writeBatch(db);

      unreadRequestsDocs.docs.forEach((request) => {
        batch.update(request.ref, {
          ...request.data(),
          isUnread: false,
        });
      });

      await batch.commit();
    }

    fetchSetAndClearUnread();
  }, [uid, requestsLength]);

  return { unreadRequestIds }

}