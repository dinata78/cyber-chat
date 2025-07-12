import { collection, doc, limit, onSnapshot, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { getConversationId, getOtherUid } from "../utils";
import { query } from "firebase/database";

export function useChat(ownUid, DMIds) {
  const [ chatMessagesMap, setChatMessagesMap ] = useState({});
  const [ chatDataMap, setChatDataMap ]= useState({});
  const [ messagesAmountMap, setMessagesAmountMap ] = useState({ default: 25 });

  const devConversationId = getConversationId(ownUid, import.meta.env.VITE_DEV_UID);

  useEffect(() => {
    if (!ownUid) return;

    let unsubscribeMessagesList = [];
    let unsubscribeDatasList = [];
    
    for (const conversationId of ["globalChat", devConversationId, ownUid, ...DMIds]) {

      const messagesQuery = query(
        collection(db, "conversations", conversationId, "messages"),
        orderBy("timeCreated", "desc"),
        limit(messagesAmountMap[conversationId] || messagesAmountMap["default"])
      );

      const unsubscribeMessages = onSnapshot(messagesQuery, { includeMetadataChanges: true }, async (snapshot) => {
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


        // fetch (subscribe to) message sender's datas
        if (conversationId === "globalChat") {
          const uniqueSenderUids = Array.from(new Set(messages.map(message => message.senderUid)));

          const missingDataIds = uniqueSenderUids.filter(id => !chatDataMap[id]);

          if (missingDataIds.length > 0) {
            const fetchedDatas = {};

            for (const senderUid of missingDataIds) {
              const senderDocRef = doc(db, "users", senderUid);

              const unsubscribeDatas = onSnapshot(senderDocRef, (snapshot) => {
                if (snapshot.exists()) {
                  fetchedDatas[senderUid] = snapshot.data();
                }

                setChatDataMap(prev => ({...prev, ...fetchedDatas}));
              });

              unsubscribeDatasList.push(unsubscribeDatas);
            }
          }
        }
        else {
          const uid = getOtherUid(conversationId, ownUid) || ownUid;

          if (!chatDataMap[uid]) {
            const fetchedDatas = {};

            const userDocRef = doc(db, "users", uid);

            const unsubscribeDatas = onSnapshot(userDocRef, (snapshot) => {
              if (snapshot.exists()) {
                fetchedDatas[uid] = snapshot.data();
              }

              setChatDataMap(prev => ({...prev, ...fetchedDatas}));
            });

            unsubscribeDatasList.push(unsubscribeDatas);
          }
        }
      });

      unsubscribeMessagesList.push(unsubscribeMessages);
    }

    return () => {
      if (unsubscribeMessagesList.length) {
        for (const unsubscribeMessages of unsubscribeMessagesList) {
          unsubscribeMessages();
        }
        unsubscribeMessagesList = [];
      }

      if (unsubscribeDatasList.length) {
        for (const unsubscribeDatas of unsubscribeDatasList) {
          unsubscribeDatas();
        }
        unsubscribeDatasList = [];
      }
    }
  }, [ownUid, DMIds, messagesAmountMap]);

  return {
    chatMessagesMap,
    chatDataMap,
    messagesAmountMap,
    setMessagesAmountMap
  };
}