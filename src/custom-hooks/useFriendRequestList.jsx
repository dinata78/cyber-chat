import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useFriendRequest(uid) {
  const [friendRequest, setFriendRequest] = useState([]);

  useEffect(() => {
    if (!uid) return;

    let unsubscribe;

    const fetchFriendRequest = async () => {
      const userDocRef = doc(db, "users", uid);
      unsubscribe = onSnapshot(userDocRef, (snapshot) => {
        const data = snapshot.data();

        setFriendRequest(data.friendRequest);
      })
    }

    fetchFriendRequest();

    return () => {
      if (unsubscribe) unsubscribe();
    } 

  }, [uid]);

  return {
    friendRequest
  }
    
}