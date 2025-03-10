import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { fetchDataFromUid } from "../utils";

export function useFriendList(uid) {
  const [friendListUids, setFriendListUids] = useState([]);
  const [friendListDatas, setFriendListDatas] = useState([]);
  
  useEffect(() => {
    if (!uid) return;

    let unsubscribe = null;

    const fetchandSetFriendUids = async () => {
      const friendListRef = collection(db, "users", uid, "friendList");

      unsubscribe = onSnapshot(friendListRef, (snapshot) => {
        if (snapshot.empty) {
          setFriendListUids([]);
        }
        else {
          const friendListUids = snapshot.docs.map(doc => doc.data().uid);

          setFriendListUids(friendListUids);
        }
      });
    }

    fetchandSetFriendUids();

    return () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    }

  }, [uid]);

  useEffect(() => {
    if (!friendListUids.length) {
      setFriendListDatas([]);
      return;
    };

    const fetchAndSetFriendDatas = async () => {
      const friendListDatas = [];
      for (const friendUid of friendListUids) {
        const friendData = await fetchDataFromUid(friendUid);
        friendListDatas.push(friendData);
      }
      setFriendListDatas(friendListDatas);
    }

    fetchAndSetFriendDatas();
  }, [friendListUids]);
  
  return {
    friendListUids,
    friendListDatas,
  }
}