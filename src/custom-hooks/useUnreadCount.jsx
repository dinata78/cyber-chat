import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { getConversationId } from "../utils";

export function useUnreadCount(ownUid, DMIds, devUid) {
  const [ unreadCountMap, setUnreadCountMap ] = useState({});

  const devConversationId = getConversationId(ownUid, devUid);

  useEffect(() => {
    if (!ownUid) return;
    if (!DMIds.length || !devConversationId) {
      setUnreadCountMap({});
      return;
    }

    let unsubscribeList = [];

    for (const conversationId of [...DMIds, devConversationId]) {
      const conversationRef = doc(db, "conversations", conversationId);

      const unsubscribe = onSnapshot(conversationRef, (snapshot) => {
        const count = snapshot.data()?.unreadCount?.[ownUid] || 0;

        setUnreadCountMap(prev => {
          const map = {...prev};
          map[conversationId] = count;
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

  }, [ownUid, DMIds, devUid]);
  
  return { unreadCountMap };
}