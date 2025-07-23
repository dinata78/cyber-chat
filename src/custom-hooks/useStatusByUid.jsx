import { useEffect, useState } from "react";
import { off, onValue, ref } from "firebase/database";
import { realtimeDb } from "../../firebase";

export function useStatusByUid(uid) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!uid) return;

    const statusRef = ref(realtimeDb, `users/${uid}`);
    
    const listener = onValue(statusRef, (snapshot) => {
      const status = snapshot.val()?.status;
      
      setStatus(status || "offline");
    });

    return () => off(statusRef, "value", listener);
    
  }, [uid]);

  return status;
}