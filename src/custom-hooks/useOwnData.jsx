import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export function useOwnData() {
  const [ ownData, setOwnData ] = useState({});

  useEffect(() => {
    let unsubscribeSnapshot;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user?.uid) {
        setOwnData({});
        return;
      }

      const ownDocRef = doc(db, "users", user.uid);

      unsubscribeSnapshot = onSnapshot(ownDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setOwnData(data);
        }
        else {
          setOwnData({});
        }
      });
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth;
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    }

  }, []);

  return { ownData };
}