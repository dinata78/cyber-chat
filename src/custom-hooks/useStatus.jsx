import { off, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { realtimeDb } from "../../firebase";

export function useStatus(ownUid, friendUids) {
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    if (!ownUid) return;
    
    let unsubscribeList = [];

    for (const uid of [import.meta.env.VITE_DEV_UID, ...friendUids]) {
      const statusRef = ref(realtimeDb, `users/${uid}`);

      const listener = onValue(statusRef, (snapshot) => {
        setStatusMap(prev => {
          const prevStatusMap = {...prev};

          const status = snapshot.val()?.status;

          prevStatusMap[uid] = status || "offline";

          return prevStatusMap;
        });
      });

      const unsubscribe = () => off(statusRef, "value", listener);
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
  }, [ownUid, friendUids]);
  
  return { statusMap };
}