import { off, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { realtimeDb } from "../../firebase";
import { useHiddenUsers } from "./useHiddenUsers";

export function useStatus(ownUid, friendUids) {
  const [statusMap, setStatusMap] = useState({});

  const { hiddenUserUids } = useHiddenUsers();

  useEffect(() => {
    if (!ownUid && !hiddenUserUids) {
      setStatusMap({});
      return;
    }

    let unsubscribeList = [];

    for (const uid of ["28qZ6LQQi3g76LLRd20HXrkQIjh1", ownUid, ...friendUids]) {

      if (hiddenUserUids.includes(uid)) {
        setStatusMap(prev => {
          const prevStatusMap = {...prev};

          prevStatusMap[uid] = "hidden";

          return prevStatusMap;
        });

        continue;
      }

      const statusRef = ref(realtimeDb, `users/${uid}`);

      onValue(statusRef, (snapshot) => {
        setStatusMap(prev => {
          const prevStatusMap = {...prev};

          prevStatusMap[uid] = snapshot.val()?.isOnline ? "online" : "offline";

          return prevStatusMap;
        });
      });

      const unsubscribe = () => off(statusRef, "value");
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
  }, [ownUid, friendUids, hiddenUserUids]);
  
  return { statusMap };
}