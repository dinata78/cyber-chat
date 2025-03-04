import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

export function useInbox(uid) {
  const [ inboxItems, setInboxItems ] = useState([]);
  
  useEffect(() => {
    if (!uid) return;

    let unsubscribe = null;

    const fetchData = async () => {
      const docRef = doc(db, "users", uid);
      
      unsubscribe = onSnapshot(docRef, (snapshot) => {
        const data = snapshot.data().inbox;
        setInboxItems(data.reverse());
      });
    }

    fetchData();

    return () => {
      if (unsubscribe) unsubscribe();
    }

  }, [uid]);

  return { inboxItems }
}