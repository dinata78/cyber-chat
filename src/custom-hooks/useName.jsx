import { useEffect, useState } from "react";
import { fetchDataFromUid } from "../utils";

export function useName(uid) {
  const [displayName, setDisplayName] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (!uid) return;

    const fetchData = async () => {
      const data = await fetchDataFromUid(uid);
      setDisplayName(data.displayName);
      setUsername(data.username);
    }

    fetchData();

  }, [uid]);

  return {
    displayName, 
    username,
  }
}