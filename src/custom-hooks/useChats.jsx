import { collection, limit, onSnapshot, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { fetchDataFromUid, getConversationId } from "../utils";
import { query } from "firebase/database";

export function useChats(uid, friendListUids) {
  const [chatMessagesMap, setChatMessagesMap] = useState({});
  const [chatUsernamesMap, setChatUsernamesMap] = useState([]);

  useEffect(() => {
    if (!uid || !friendListUids) return;

    let unsubscribeList = [];
    
    for (const friendUid of ["globalChat", "28qZ6LQQi3g76LLRd20HXrkQIjh1", uid, ...friendListUids]) {
      const conversationId = getConversationId(uid, friendUid);

      const messagesQuery = query(
        collection(db, "conversations", conversationId, "messages"),
        orderBy("timeCreated", "desc"),
        limit(50)
      )

      const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
        const messages = snapshot.docs.map(doc => doc.data());

        setChatMessagesMap(prev => {
          const prevMessages = prev;

          prevMessages[conversationId] = messages.sort((a, b) => a.timeCreated - b.timeCreated);

          return prevMessages;
        });

        const uniqueSenderIds = Array.from(new Set(messages.map(message => message.senderId)));
        const missingUsernameIds = uniqueSenderIds.filter(id => !chatUsernamesMap[id]);

        if (missingUsernameIds.length > 0) {
          const fetchedNames = {};
    
          for (const senderId of missingUsernameIds) {
            const senderDocData = await fetchDataFromUid(senderId);
    
            if (senderDocData) {
              fetchedNames[senderId] = senderDocData.displayName;
            }
            else {
              fetchedNames[senderId] = "<deleted>"
            }
          }

          setChatUsernamesMap((prev) => ({...prev, ...fetchedNames}));
        }
      });

      unsubscribeList.push(unsubscribe);
    }

    return () => {
      if (unsubscribeList.length) {
        for (const unsubscribe of unsubscribeList) {
          unsubscribe();
        }
        unsubscribeList = [];
      }
    }
  }, [uid, friendListUids]);

  return { chatMessagesMap, chatUsernamesMap };
}