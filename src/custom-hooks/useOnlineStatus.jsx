import { useEffect, useState } from "react";
import { off, onValue, ref } from "firebase/database";
import { realtimeDb } from "../../firebase";
import { useHiddenUsers } from "./useHiddenUsers";

export function useOnlineStatus(uid) {
  const [onlineStatus, setOnlineStatus] = useState(null);

  const { hiddenUserUids } = useHiddenUsers();

  useEffect(() => {
    if (!uid) return;
    if (!hiddenUserUids || hiddenUserUids.includes(uid)) {
      setOnlineStatus("hidden");
      return;
    }
    
    const dbRef = ref(realtimeDb, `users/${uid}`);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
    
      setOnlineStatus(data?.isOnline ? "online" : "offline");
    });

    return () => off(dbRef);
    
  }, [uid, hiddenUserUids]);

  return { onlineStatus };
}