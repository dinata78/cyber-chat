import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useFriendList(uid) {
  const [friendListUids, setFriendListUids] = useState([]);
  const [friendListDatas, setFriendListDatas] = useState([]);
  
  useEffect(() => {
    if (!uid) return;

    const friendListRef = collection(db, "users", uid, "friendList");

    const unsubscribe = onSnapshot(friendListRef, (snapshot) => {
      if (snapshot.empty) {
        setFriendListUids([]);
      }
      else {
        const friendListUids = snapshot.docs.map(doc => doc.data().uid);

        setFriendListUids(friendListUids);
      }
    });

    return () => unsubscribe();
  }, [uid]);

  useEffect(() => {
    if (!friendListUids.length) {
      setFriendListDatas([]);
      return;
    };

    let unsubscribeList = [];

    for (const friendUid of friendListUids) {
      const friendDocRef = doc(db, "users", friendUid);
      
      const unsubscribe = onSnapshot(friendDocRef, (snapshot) => {
        setFriendListDatas((prev) => {
          let previousDatas = prev;

          const currentDataIndex = previousDatas.findIndex(data => data.uid === snapshot.data().uid);

          if (currentDataIndex >= 0) {
            previousDatas[currentDataIndex] = snapshot.data();
          }
          else {
           previousDatas.push(snapshot.data());
          }

          return previousDatas.filter(data => friendListUids.includes(data.uid));
        });
      });

      unsubscribeList.push(unsubscribe);
    }

    return () => {
      if (unsubscribeList.length) {
        for (const unsubscribe of unsubscribeList) {
          unsubscribe();
        }
        unsubscribeList = [];
      }
    }
  }, [friendListUids]);
  
  return {
    friendListUids,
    friendListDatas,
  }
}