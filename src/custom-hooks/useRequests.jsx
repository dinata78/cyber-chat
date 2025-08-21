import { and, collection, onSnapshot, or, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useRequests(ownUid) {
  const [ requests, setRequests ] = useState([]);

  useEffect(() => {
    let unsubscribe = null;

    const getAndSetRequests = async () => {
      if (!ownUid) return;

      const requestsQuery = query(
        collection(db, "requests"),
        and(
          where("status", "==", "pending"),
          or(
            where("from", "==", ownUid),
            where("to", "==", ownUid)
          )
        )
      );

      unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
        if (snapshot.docs.length > 0) {
          const requests = snapshot.docs.map(doc => (
            {
              id: doc.id,
              from: doc.data().from,
              to: doc.data().to,
              timeCreated: doc.data().timeCreated
            }
          ));
          setRequests(requests);
        }
        else {
          setRequests([]);
        }
      });
    }

    getAndSetRequests();

    return () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    }
  }, [ownUid]);

  return { requests };
}