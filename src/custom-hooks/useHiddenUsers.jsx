import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useHiddenUsers() {
  const [hiddenUserUids, setHiddenUserUids] = useState(undefined);

  useEffect(() => {
    const hiddenUsersRef = collection(db, "users", "metadata", "hiddenUsers");

    const unsubscribe = onSnapshot(hiddenUsersRef, (snapshot) => {
      if (snapshot.empty) {
        setHiddenUserUids([]);
      }
      else {
        const hiddenUserUids = snapshot.docs.map(doc => doc.data().uid);

        setHiddenUserUids(hiddenUserUids);
      }
    })
  
    return () => unsubscribe();
  }, []);

  return { hiddenUserUids };
}