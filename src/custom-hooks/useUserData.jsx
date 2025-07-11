import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useUserData(uid) {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (!uid) {
      setUserData({});
      return;
    }

    const userDocRef = doc(db, "users", uid);

    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.data();
        setUserData(userData);
      }
      else {
        setUserData({});
      }
    });

    return () => unsubscribe();

  }, [uid]);

  return [ userData ];
}