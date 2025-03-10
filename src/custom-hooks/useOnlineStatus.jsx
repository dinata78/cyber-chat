import { useEffect, useState } from "react";
import { off, onValue, ref } from "firebase/database";
import { realtimeDb } from "../../firebase";
import { useMetadata } from "./useMetadata";

export function useOnlineStatus(uid) {
  const [onlineStatus, setOnlineStatus] = useState(null);

  const { hiddenUsers } = useMetadata();

  useEffect(() => {
    if (!uid) return;
    if (!hiddenUsers || hiddenUsers.includes(uid)) {
      setOnlineStatus("hidden");
      return;
    }
    
    const dbRef = ref(realtimeDb, `users/${uid}`);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
    
      setOnlineStatus(data?.isOnline ? "online" : "offline");
    });

    return () => off(dbRef);
    
  }, [uid, hiddenUsers]);

  return { onlineStatus };
}