import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useRequests(uid) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!uid) return;

    let unsubscribe = null;
    
    const fetchAndSetRequests = async () => {
      const requestsQuery = query(
        collection(db, "users", uid, "requests"),
        orderBy("timeCreated", "desc"),
      )
  
      unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
        if (snapshot.empty) {
          setRequests([]);
        }
        else {
          const requests = snapshot.docs.map(request => (
            {
              ...request.data(),
              id: request.id,
            }
          ));

          setRequests(requests);
        }
      });        
    }

    fetchAndSetRequests();

    return () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    }

  }, [uid]);

  return { requests }
}