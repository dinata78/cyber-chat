import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react"
import { db } from "../../firebase";

export function useTypingUids(conversationId) {
  const [ typingUids, setTypingUids ] = useState([]);

  useEffect(() => {
    if (!conversationId) return;

    const conversationRef = doc(db, "conversations", conversationId);

    const unsubscribe = onSnapshot(conversationRef, (snapshot) => {
      if (snapshot.exists()) {
        setTypingUids(snapshot.data().typingUids || []);
      }
      else {
        setTypingUids([]);
      }
    });

    return () => unsubscribe();
  }, [conversationId]);

  return { typingUids };
};