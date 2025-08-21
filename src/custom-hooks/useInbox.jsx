import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export function useInbox(ownUid) {
  const [inbox, setInbox] = useState([]);

  useEffect(() => {
    let unsubscribe = null;

    const getAndSetInbox = async () => {
      if (!ownUid) return;

      const inboxRef = collection(db, "users", ownUid, "inbox");

      unsubscribe = onSnapshot(inboxRef, (snapshot) => {
        if (snapshot.docs.length > 0) {
          const inbox = snapshot.docs.map(doc => (
            {
              id: doc.id,
              ...doc.data()
            }
          ));
          setInbox(inbox);
        }
        else {
          setInbox([]);
        }
      });
    }

    getAndSetInbox();

    return () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    }
  }, [ownUid]);

  return { inbox };
}