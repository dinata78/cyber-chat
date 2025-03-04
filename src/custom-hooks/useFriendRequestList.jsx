import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useFriendRequestList(uid) {
  const [friendRequestList, setFriendRequestList] = useState([]);

  useEffect(() => {
    if (!uid) return;

    let unsubscribe;

    const fetchFriendRequestList = async () => {
      const userDocRef = doc(db, "users", uid);
      unsubscribe = onSnapshot(userDocRef, (snapshot) => {
        const data = snapshot.data();

        setFriendRequestList(data.friendRequest);        
      })
    }

    fetchFriendRequestList();

    return () => {
      if (unsubscribe) unsubscribe();
    } 

  }, [uid]);

  return {
    friendRequestList
  }
    
}