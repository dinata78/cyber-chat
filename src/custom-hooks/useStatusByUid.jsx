import { useEffect, useState } from "react";
import { off, onValue, ref } from "firebase/database";
import { realtimeDb } from "../../firebase";
import { useHiddenUsers } from "./useHiddenUsers";

export function useStatusByUid(uid) {
  const [status, setStatus] = useState(null);

  const { hiddenUserUids } = useHiddenUsers();

  useEffect(() => {
    if (!uid) return;
    if (!hiddenUserUids || hiddenUserUids.includes(uid)) {
      setStatus("hidden");
      return;
    }
    
    const statusRef = ref(realtimeDb, `users/${uid}`);
    
    onValue(statusRef, (snapshot) => {    
      setStatus(snapshot.val()?.isOnline ? "online" : "offline");
    });

    return () => off(statusRef, "value");
    
  }, [uid, hiddenUserUids]);

  return { status };
}