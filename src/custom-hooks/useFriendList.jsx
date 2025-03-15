import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useFriendList(uid) {
  const [friendUids, setFriendUids] = useState([]);
  const [friendDatas, setFriendDatas] = useState([]);

  useEffect(() => {
    if (!uid) return;

    const friendListRef = collection(db, "users", uid, "friendList");

    const unsubscribe = onSnapshot(friendListRef, (snapshot) => {
      if (snapshot.empty) {
        setFriendUids([]);
      }
      else {
        const friendUids = snapshot.docs.map(doc => doc.data().uid);

        setFriendUids(friendUids);
      }
    });

    return () => unsubscribe();
  }, [uid]);

  useEffect(() => {
    if (!friendUids.length) {
      setFriendDatas([]);
      return;
    };

    let unsubscribeList = [];

    for (const friendUid of friendUids) {
      const friendDocRef = doc(db, "users", friendUid);
      
      const unsubscribe = onSnapshot(friendDocRef, (snapshot) => {
        setFriendDatas((prev) => {
          const previousDatas = prev;

          const currentDataIndex = previousDatas.findIndex(data => data.uid === snapshot.data().uid);

          if (currentDataIndex >= 0) {
            previousDatas[currentDataIndex] = snapshot.data();
          }
          else {
           previousDatas.push(snapshot.data());
          }

          return previousDatas.filter(data => friendUids.includes(data.uid));
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
  }, [friendUids]);

  return { friendUids, friendDatas }
}