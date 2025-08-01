import { and, collection, getDocs, onSnapshot, or, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useRequests(ownUid) {
  const [ requests, setRequests ] = useState([]);

  useEffect(() => {
    let unsubscribeSnapshot = null;

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

      const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
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

      unsubscribeSnapshot = unsubscribe;
    }

    getAndSetRequests();

    return () => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }
    }
  }, [ownUid]);

  return { requests };
}