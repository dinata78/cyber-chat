import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { fetchDataFromUid } from "../utils";

export function useFriendList(userData) {
  const [friendUidList, setFriendUidList] = useState([]);
  const [friendDataList, setFriendDataList] = useState([]);
  
  useEffect(() => {
    if (!userData.uid) return;

    let unsubscribe;

    const fetchFriendList = async () => {
      const userDocRef = doc(db, "users", userData.uid);

      unsubscribe = onSnapshot(userDocRef, (snapshot) => {
        const friendList = snapshot.data().friendList;
        setFriendUidList(friendList);
      });
    }

    fetchFriendList();

    return () => {
      if (unsubscribe) unsubscribe();
    }

  }, [userData]);

  useEffect(() => {
    if (friendUidList.length < 1) {
      setFriendDataList([]);
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