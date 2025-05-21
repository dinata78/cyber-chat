import { useEffect } from "react";
import { realtimeDb } from "../../firebase";
import { get, onDisconnect, ref, update } from "firebase/database";

export function useSetOwnStatus(ownUid) {
  useEffect(() => {
    if (!ownUid) return;
    
    const setOnlineStatus = async () => {
      const ownStatusRef = ref(realtimeDb, `users/${ownUid}`);
    
      const currentStatus = await get(ownStatusRef);
      
      if (currentStatus.val()?.status !== "hidden") {
        await update(ownStatusRef, { status: "online" });
    
        onDisconnect(ownStatusRef).update({ status: "offline" });
      }
      else {
        onDisconnect(ownStatusRef).cancel();
      }
    }
    
    setOnlineStatus();
  }, [ownUid]);
}