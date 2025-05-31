import { collection, limit, onSnapshot, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { fetchDataFromUid, getConversationId, getOtherUid } from "../utils";
import { query } from "firebase/database";

export function useChat(ownUid, DMIds) {
  const [ chatMessagesMap, setChatMessagesMap ] = useState({});
  const [ chatDisplayNameMap, setChatDisplayNameMap ] = useState({});
  const [ chatUsernameMap, setChatUsernameMap ] = useState({});
  const [ chatPfpUrlMap, setChatPfpUrlMap ] = useState({});
  const [ messagesAmountMap, setMessagesAmountMap ] = useState({ default: 25 });

  const devConversationId = getConversationId(ownUid, import.meta.env.VITE_DEV_UID);

  useEffect(() => {
    if (!ownUid) return;

    let unsubscribeList = [];
    
    for (const conversationId of ["globalChat", devConversationId, ownUid, ...DMIds]) {

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

        if (conversationId === "globalChat") {
          const uniqueSenderIds = Array.from(new Set(messages.map(message => message.senderId)));

          const missingDataIds = uniqueSenderIds.filter(id => {
            return (
              !chatDisplayNameMap[id]
              || !chatUsernameMap[id]
              || !chatPfpUrlMap[id]
            );
          });

          if (missingDataIds.length > 0) {
            const fetchedDisplayNames = {};
            const fetchedUsernames = {};
            const fetchedPfpUrls = {};
      
            for (const senderId of missingDataIds) {
              const senderDocData = await fetchDataFromUid(senderId);
      
              if (senderDocData) {
                fetchedDisplayNames[senderId] = senderDocData.displayName;
                fetchedUsernames[senderId] = senderDocData.username;
                fetchedPfpUrls[senderId] = senderDocData.pfpUrl;
              }
              else {
                fetchedDisplayNames[senderId] = "<???>";
                fetchedUsernames[senderId] = "";
                fetchedPfpUrls[senderId] = "";
              }
            }

            setChatDisplayNameMap(prev => ({...prev, ...fetchedDisplayNames}));
            setChatUsernameMap(prev => ({...prev, ...fetchedUsernames}));
            setChatPfpUrlMap(prev => ({...prev, ...fetchedPfpUrls}));
          }
        }
        else {
          const uid = getOtherUid(conversationId, ownUid) || ownUid;

          if (
            !chatDisplayNameMap[uid]
            || !chatUsernameMap[uid]
            || !chatPfpUrlMap[uid]
          ) {
            const fetchedDisplayName = {};
            const fetchedUsername = {};
            const fetchedPfpUrl = {};

            const userDocData = await fetchDataFromUid(uid);
    
            if (userDocData) {
              fetchedDisplayName[uid] = userDocData.displayName;
              fetchedUsername[uid] = userDocData.username;
              fetchedPfpUrl[uid] = userDocData.pfpUrl;
            }
            else {
              fetchedDisplayName[uid] = "<???>";
              fetchedUsername[uid] = "";
              fetchedPfpUrl[uid] = "";
            }

            setChatDisplayNameMap(prev => ({...prev, ...fetchedDisplayName}));
            setChatUsernameMap(prev => ({...prev, ...fetchedUsername}));
            setChatPfpUrlMap(prev => ({...prev, ...fetchedPfpUrl}));            
          }
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
  }, [ownUid, DMIds, messagesAmountMap]);

  return {
    chatMessagesMap,
    chatDisplayNameMap,
    chatUsernameMap,
    chatPfpUrlMap,
    messagesAmountMap,
    setMessagesAmountMap
  };
}