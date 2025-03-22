import { collection, doc, limit, onSnapshot, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { fetchDataFromUid, getConversationId } from "../utils";
import { query } from "firebase/database";

export function useChats(ownUid, friendUids) {
  const [chatMessagesMap, setChatMessagesMap] = useState({});
  const [chatUsernamesMap, setChatUsernamesMap] = useState({});
  const [messagesAmountMap, setMessagesAmountMap] = useState({default: 25});

  useEffect(() => {
    if (!ownUid) return;

    let unsubscribeList = [];
    
    for (const uid of ["globalChat", "28qZ6LQQi3g76LLRd20HXrkQIjh1", ownUid, ...friendUids]) {
      const conversationId = getConversationId(ownUid, uid);

      const messagesQuery = query(
        collection(db, "conversations", conversationId, "messages"),
        orderBy("timeCreated", "desc"),
        limit(messagesAmountMap[conversationId] || messagesAmountMap["default"])
      );

      const unsubscribe = onSnapshot(messagesQuery, { includeMetadataChanges: true }, async (snapshot) => {
        const messages = snapshot.docs.map(doc => {
          return {
            id: doc.id,
            isSending: doc.metadata.hasPendingWrites,
            ...doc.data()
          }
      });

        setChatMessagesMap(prev => {
          const prevMessages = {...prev};

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
              fetchedNames[senderId] = "<deleted>";
            }
          }

          setChatUsernamesMap(prev => ({...prev, ...fetchedNames}));
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
  }, [ownUid, friendUids, messagesAmountMap]);

  return { chatMessagesMap, chatUsernamesMap, messagesAmountMap, setMessagesAmountMap };
}