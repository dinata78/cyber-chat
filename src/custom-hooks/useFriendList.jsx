import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { fetchDataFromUid } from "../utils";

export function useFriendList(uid) {
  const [friendUidList, setFriendUidList] = useState([]);
  const [friendDataList, setFriendDataList] = useState([]);
  
  useEffect(() => {
    if (!uid) return;

    let unsubscribe = null;

    const fetchFriendList = async () => {
      const userDocRef = doc(db, "users", uid);

      unsubscribe = onSnapshot(userDocRef, (snapshot) => {
        const data = snapshot.data();
        if (data.friendList) {
          setFriendUidList(data.friendList)
        }
      });
    }

    fetchFriendList();

    return () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    }

  }, [uid]);

  useEffect(() => {
    if (!friendUidList.length) {
      return;
    };

    const fetchFriendData = async () => {
      const data = [];
      for (const friendUid of friendUidList) {
        const friendData = await fetchDataFromUid(friendUid);
        data.push(friendData);
      }
      setFriendDataList(data);
    }

    fetchFriendData();
  }, [friendUidList]);
  
  return {
    friendUidList,
    friendDataList,
  }
}