import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useFriendRequestList(userData) {
  const [friendRequestSentList, setFriendRequestSentList] = useState([]);
  const [friendRequestReceivedList, setFriendRequestReceivedList] = useState([]);
  
  useEffect(() => {
    if (!userData.uid) return;

    let unsubscribe;

    const fetchFriendRequestList = async () => {
      const userDocRef = doc(db, "users", userData.uid);
      unsubscribe = onSnapshot(userDocRef, (snapshot) => {
        const data = snapshot.data();

        setFriendRequestSentList(data.friendRequestSent);
        setFriendRequestReceivedList(data.friendRequestReceived);
      })
    }

    fetchFriendRequestList();

    return () => {
      if (unsubscribe) unsubscribe();
    } 

  }, [userData]);

  return {
    friendRequestSentList,
    friendRequestReceivedList,
  }
    
}