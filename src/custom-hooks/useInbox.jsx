import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";

export function useInbox(uid) {
  const [ inboxItems, setInboxItems ] = useState([]);
  
  useEffect(() => {
    if (!uid) return;

    let unsubscribe = null;

    const fetchAndSetInbox = async () => {
      const inboxQuery = query(
        collection(db, "users", uid, "inbox"),
        orderBy("timeCreated", "desc"),
      )
      
      unsubscribe = onSnapshot(inboxQuery, (snapshot) => {
        if (snapshot.empty) {
          setInboxItems([]);
        }
        else {
          const inboxItems = snapshot.docs.map(item => (
            {
              id: item.id,
              content: item.data().content,
              timeCreated: item.data().timeCreated,
              isUnread: item.data().isUnread,
            }
          ));

          setInboxItems(inboxItems);
        }
      });
    }

    fetchAndSetInbox();
    

    return () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    }

  }, [uid]);

  return { inboxItems }
}