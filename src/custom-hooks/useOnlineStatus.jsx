import { useEffect, useState } from "react";
import { off, onValue, ref } from "firebase/database";
import { realtimeDb } from "../../firebase";
import { useMetadata } from "./useMetadata";

export function useOnlineStatus(uid) {
  const [onlineStatus, setOnlineStatus] = useState(null);

  const { hiddenUsers } = useMetadata();

  useEffect(() => {
    let unTrack = null;

    if (hiddenUsers.includes(uid)) {
      setOnlineStatus("hidden");
    }
    else {
      const dbRef = ref(realtimeDb, `users/${uid}`);
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
      
        if (data?.isOnline) {
          setOnlineStatus("online");
        }
        else {
          setOnlineStatus("offline");
        }
      });

      unTrack = () => off(dbRef);
    }

    return () => {
      if (unTrack) {
        unTrack();
        unTrack = null;
      }
    }
    
  }, [uid, hiddenUsers]);

  return { onlineStatus };
}