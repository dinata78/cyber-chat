import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useUserData(uid) {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (!uid) return;

    const userDocRef = doc(db, "users", uid);

    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      const userData = snapshot.data();
      setUserData(userData);
    });

    return () => unsubscribe();

  }, [uid]);

  return [ userData ];
}