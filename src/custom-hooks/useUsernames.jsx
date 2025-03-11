import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react"
import { db } from "../../firebase";

export function useUsernames() {
  const [usernames, setUsernames] = useState({});

  useEffect(() => {
    const usernamesRef = collection(db, "users", "metadata", "usernames");

    const unsubscribe = onSnapshot(usernamesRef, (snapshot) => {
      let usernames = {};

      snapshot.docs.forEach(doc => {
        usernames[doc.data().uid] = doc.data().username;
      });

      setUsernames(usernames);
    })

    return () => unsubscribe();
  }, []);

  return { usernames };
}