import { collection, doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../firebase"
import { getOtherUid } from "../utils";

export function useDM(uid) {
  const [DMIds, setDMIds] = useState([]);
  const [DMDatas, setDMDatas] = useState([]);

  const otherUids = DMIds.map(DMId => getOtherUid(DMId, uid));

  useEffect(() => {
    if (!uid) return;

    const ownDMRef = collection(db, "users", uid, "activeDM");

    const unsubscribe = onSnapshot(ownDMRef, (snapshot) => {
      if (snapshot.empty) {
        setDMIds([]);
      }
      else {
        const fetchedDMIds = snapshot.docs.map(doc => doc.data().conversationId);
        setDMIds(fetchedDMIds);
      }
    });

    return () => unsubscribe();
  }, [uid]);

  useEffect(() => {
    if (!DMIds.length) {
      setDMDatas([]);
      return;
    }

    let unsubscribeList = [];

    for (const DMId of DMIds) {
      const otherUid = getOtherUid(DMId, uid);
      const otherDocRef = doc(db, "users", otherUid);
      
      const unsubscribe = onSnapshot(otherDocRef, (snapshot) => {
        setDMDatas((prev) => {
          const previousDatas = prev;

          const currentDataIndex = previousDatas.findIndex(data => data.uid === snapshot.data().uid);

          if (currentDataIndex >= 0) {
            previousDatas[currentDataIndex] = snapshot.data();
          }
          else {
            previousDatas.push(snapshot.data());
          }

          return previousDatas.filter(data => otherUids.includes(data.uid));
        });
      });

      unsubscribeList.push(unsubscribe);
    }

    return () => {
      if (unsubscribeList.length) {
        for (const unsubscribe of unsubscribeList) {
          unsubscribe();
        };
        unsubscribeList = [];
      }
    }

  }, [DMIds]);

  return { DMDatas };
}