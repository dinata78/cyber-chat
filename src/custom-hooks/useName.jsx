import { useEffect, useState } from "react";
import { fetchDataFromUid } from "../utils";

export function useName(uid) {
  const [displayName, setDisplayName] = useState(null);
  const [username, setUsername] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDataFromUid(uid);
      setDisplayName(data.name);
      setUsername(data.username);
    }

    fetchData();

  }, []);

  return {
    displayName, 
    username,
  }
}