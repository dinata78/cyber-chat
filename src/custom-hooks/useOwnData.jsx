import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export function useOwnData() {
    const [ ownData, setOwnData ] = useState([]);

    useEffect(() => {
      let unsubscribeSnapshot;

      const unsubcribeAuth = onAuthStateChanged(auth, (user) => {
        if (!user?.uid) return;

        const ownDocRef = doc(db, "users", user.uid);

        unsubscribeSnapshot = onSnapshot(ownDocRef, (snapshot) => {
          const data = snapshot.data();
          setOwnData(data);
        });
      })

      return () => {
        if (unsubcribeAuth) unsubcribeAuth();
        if (unsubscribeSnapshot) unsubscribeSnapshot;
      }

    }, []);

    return { ownData };
}