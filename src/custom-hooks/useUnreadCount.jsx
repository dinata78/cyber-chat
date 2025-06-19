import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useUnreadCount(ownUid, DMIds) {
  const [ unreadCountMap, setUnreadCountMap ] = useState({});

  useEffect(() => {
    if (!ownUid) return;
    if (!DMIds.length) {
      setUnreadCountMap({});
      return;
    }

    let unsubscribeList = [];

    for (const DMId of DMIds) {
      const conversationRef = doc(db, "conversations", DMId);

      const unsubscribe = onSnapshot(conversationRef, (snapshot) => {
        const count = snapshot.data().unreadCount?.[ownUid] || 0;

        setUnreadCountMap(prev => {
          const map = {...prev};
          map[DMId] = count;
          return map;
        });
      });

      unsubscribeList.push(unsubscribe);
    }

    return () => {
      if (unsubscribeList.length) {
        for (const unsubscribe of unsubscribeList) {
          unsubscribe();
        }
        unsubscribeList = [];
      }
    }

  }, [ownUid, DMIds]);
  
  return { unreadCountMap };
}