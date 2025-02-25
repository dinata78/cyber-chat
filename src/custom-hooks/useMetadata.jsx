import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useMetadata() {
  const [usernames, setUsernames] = useState({});
  const [hiddenUsers, setHiddenUsers] = useState([]);

  useEffect(() => {
    let unsubscribe;

    const fetchMetadata = async () => {
      const metadataDocRef = doc(db, "users", "metadata");
      unsubscribe = onSnapshot(metadataDocRef, (snapshot) => {
        const data = snapshot.data()
        setUsernames(data.usernames);
        setHiddenUsers(data.hiddenUsers);
      })
    };

    fetchMetadata();
  }, []);

  return { usernames, hiddenUsers };
}