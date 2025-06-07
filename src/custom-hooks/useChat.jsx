import { collection, doc, limit, onSnapshot, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { getConversationId, getOtherUid } from "../utils";
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


        // fetch (subscribe to) message sender's necessary datas
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
              const senderDocRef = doc(db, "users", senderId);

              const unsubscribeDatas = onSnapshot(senderDocRef, (snapshot) => {
                if (snapshot.exists()) {
                  fetchedDisplayNames[senderId] = snapshot.data().displayName;
                  fetchedUsernames[senderId] = snapshot.data().username;
                  fetchedPfpUrls[senderId] = snapshot.data().pfpUrl;
                }
                else {
                  fetchedDisplayNames[senderId] = "<???>";
                  fetchedUsernames[senderId] = "";
                  fetchedPfpUrls[senderId] = "";
                }

                setChatDisplayNameMap(prev => ({...prev, ...fetchedDisplayNames}));
                setChatUsernameMap(prev => ({...prev, ...fetchedUsernames}));
                setChatPfpUrlMap(prev => ({...prev, ...fetchedPfpUrls}));
              });

              unsubscribeDatasList.push(unsubscribeDatas);
            }
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

            const userDocRef = doc(db, "users", uid);

            const unsubscribeDatas = onSnapshot(userDocRef, (snapshot) => {
              if (snapshot.exists()) {
                fetchedDisplayName[uid] = snapshot.data().displayName;
                fetchedUsername[uid] = snapshot.data().username;
                fetchedPfpUrl[uid] = snapshot.data().pfpUrl;
              }
              else {
                fetchedDisplayName[uid] = "<???>";
                fetchedUsername[uid] = "";
                fetchedPfpUrl[uid] = "";
              }

              setChatDisplayNameMap(prev => ({...prev, ...fetchedDisplayName}));
              setChatUsernameMap(prev => ({...prev, ...fetchedUsername}));
              setChatPfpUrlMap(prev => ({...prev, ...fetchedPfpUrl}));
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
    chatDisplayNameMap,
    chatUsernameMap,
    chatPfpUrlMap,
    messagesAmountMap,
    setMessagesAmountMap
  };
}