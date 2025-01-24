import { useEffect, useState } from "react";
import { off, onValue, ref } from "firebase/database";
import { realtimeDb } from "../../firebase";

export function useTrackOnlineStatus(uid) {
  const [onlineStatus, setOnlineStatus] = useState(null);
  
    useEffect(() => {
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
  
      return () => off(dbRef);
    }, []);

    return { onlineStatus };
}