import { ChatCard } from "./ChatCard";
import { SearchSVG } from "../../svg/SearchSVG";
import { ArrowLeftSVG } from "../../svg/ArrowLeftSVG";
import { MessageCard } from "./MessageCard";
import { useEffect, useRef, useState } from "react";
import { addDoc, collection, getDocs, query, where, writeBatch } from "firebase/firestore";
import { db } from "../../../../firebase";
import { fetchDataFromUid, getConversationId, normalizeSpaces } from "../../../utils";
import { chatCardOnClick } from "./chatCardOnClick";

export function Chats({ ownData, selectedChatUid, setSelectedChatUid, friendDatas, chatMessagesMap, chatUsernamesMap, messagesAmountMap, setMessagesAmountMap, statusMap }) {

  const [conversationId, setConversationId] = useState(null); 
  const [currentChatData, setCurrentChatData] = useState({displayName: "Loading...", title: "Loading...", uid: null});
  const [messageInput, setMessageInput] = useState("");
  const [hasOlderMessages, setHasOlderMessages] = useState(false);

  const selectedChatMessages = chatMessagesMap[conversationId];
  const selectedChatMessagesMaxAmount = messagesAmountMap[conversationId] || messagesAmountMap["default"];

  const latestMessageId = selectedChatMessages ? selectedChatMessages[selectedChatMessages.length - 1]?.id : undefined;

  const prevSelectedChatUid = useRef("");
  
  const chatMessagesRef = useRef(null);

  const addMessage = async () => {    
    if (selectedChatMessages.length === selectedChatMessagesMaxAmount) {
      setMessagesAmountMap(prev => {
        const prevMessagesAmountMap = {...prev};
  
        prevMessagesAmountMap[conversationId] = selectedChatMessagesMaxAmount + 1;
  
        return prevMessagesAmountMap;
      });
    }

    const newMessage = normalizeSpaces(messageInput);
    setMessageInput("");
    
    if (!newMessage) return;

    const messagesRef = collection(db, "conversations", conversationId, "messages");

    await addDoc(messagesRef, {
      isEdited: false,
      isDeleted: false,
      content: newMessage,
      senderId: ownData.uid,
      timeCreated: new Date(),
      isUnread: ["globalChat", ownData.uid].includes(selectedChatUid) ? false : true,
    });  
  }

  const loadOlderMessages = () => {
    const prevScrollHeight = chatMessagesRef.current.scrollHeight;

    setMessagesAmountMap(prev => {
      const prevMessagesAmountMap = {...prev};

      prevMessagesAmountMap[conversationId] = selectedChatMessagesMaxAmount + 25; 

      return prevMessagesAmountMap;
    });

    requestAnimationFrame(() => {
      chatMessagesRef.current.scrollTo({
        top: chatMessagesRef.current.scrollHeight - prevScrollHeight,
        behavior: "smooth",
      });
    });
  }

  useEffect(() => {
    const selectChatOnRender = async () => {
      if (selectedChatUid === "globalChat") {
        chatCardOnClick(
          ownData.uid,
          {displayName: "Global Chat", title: "A global room everyone can access", uid: "globalChat"},
          setCurrentChatData,
          setConversationId,
          null,
          setSelectedChatUid,
          chatMessagesRef
        );
      }
      else if (selectedChatUid === import.meta.env.VITE_DEV_UID) {
        chatCardOnClick(
          ownData.uid,
          {displayName: "Steven Dinata", title: "Developer of CyberChat", uid: import.meta.env.VITE_DEV_UID},
          setCurrentChatData,
          setConversationId,
          null,
          setSelectedChatUid,
          chatMessagesRef
        );
      }
      else {
        const chatData = await fetchDataFromUid(selectedChatUid);

        chatCardOnClick(
          ownData.uid,
          {displayName: chatData.uid === ownData.uid ? chatData.displayName + " (You)" : chatData.displayName, title: chatData.title, uid: chatData.uid},
          setCurrentChatData,
          setConversationId,
          null,
          setSelectedChatUid,
          chatMessagesRef
        );
      }
    }

    selectChatOnRender();
  }, [ownData.uid]);

  useEffect(() => {
    if (!ownData.uid) return;
    if (!prevSelectedChatUid.current || ["globalChat", ownData.uid].includes(prevSelectedChatUid.current)) return;

    const conversationId = getConversationId(ownData.uid, prevSelectedChatUid.current)

    const clearUnread = async () => {
      const unreadMessagesQuery = query(
        collection(db, "conversations", conversationId, "messages"),
        where("senderId", "==", prevSelectedChatUid.current),
        where("isUnread", "==", true)
      );
    
      const unreadMessagesDocs = await getDocs(unreadMessagesQuery);
     
      if (unreadMessagesDocs.docs.length) {
        const batch = writeBatch(db);
        unreadMessagesDocs.docs.forEach(doc => {
          batch.update(doc.ref, {...doc.data(), isUnread: false});
        });
    
        await batch.commit();
      }
    }

    clearUnread();

  }, [selectedChatUid, selectedChatMessages]);

  useEffect(() => {
    prevSelectedChatUid.current = selectedChatUid;
  }, [selectedChatUid]);

  useEffect(() => {
    if (!chatMessagesRef.current) return;

    requestAnimationFrame(() => {
      chatMessagesRef.current.scrollTo({
        top: chatMessagesRef.current.scrollHeight - chatMessagesRef.current.clientHeight,
        behavior: "smooth"
      });
    });
  }, [latestMessageId]);

  useEffect(() => {
    if (!selectedChatMessages?.length) return; 

    if (selectedChatMessages.length >= selectedChatMessagesMaxAmount) {
      setHasOlderMessages(true);
    }
    else {
      setHasOlderMessages(false);
    }

  }, [selectedChatMessages, messagesAmountMap]);

  return (
    <div id="cyber-chats">
      <div id="cyber-chats-aside">

        <div id="chats-aside-top">
          <div className="top">
            <h1>Chats</h1>
          </div>
          <div className="bottom">
            <div id="chats-aside-search">
              <div><SearchSVG /></div>
              <input type="text" placeholder="Search" />
            </div>
          </div>
        </div>

        <div id="chats-aside-bottom" className="overflow-y-support">
          <ChatCard
            ownUid={ownData.uid}
            displayName="Global Chat"
            username={null}
            title="A global room everyone can access" 
            uid="globalChat"
            status= "online"
            unreadMessagesCount={0}
            setCurrentChatData={setCurrentChatData}
            setConversationId={setConversationId}
            selectedChatUid={selectedChatUid}
            setSelectedChatUid={setSelectedChatUid}
            chatMessagesRef={chatMessagesRef}
          />
          {
            ownData.uid != import.meta.env.VITE_DEV_UID ?
              <ChatCard 
                ownUid={ownData.uid}
                displayName="Steven Dinata"
                username={null}
                title="Developer of CyberChat" 
                uid={import.meta.env.VITE_DEV_UID}
                status={statusMap[import.meta.env.VITE_DEV_UID]}
                unreadMessagesCount={
                  Array.isArray(chatMessagesMap[getConversationId(ownData.uid, import.meta.env.VITE_DEV_UID)]) ?
                    chatMessagesMap[getConversationId(ownData.uid, import.meta.env.VITE_DEV_UID)]
                    .filter(message => message.isUnread && message.senderId !== ownData.uid)
                    .length
                  : 0
                }
                setCurrentChatData={setCurrentChatData}
                setConversationId={setConversationId}
                selectedChatUid={selectedChatUid}
                setSelectedChatUid={setSelectedChatUid}
                chatMessagesRef={chatMessagesRef}
              />
            : null
          }
          <ChatCard
            ownUid={ownData.uid}
            displayName={ownData.displayName ? ownData.displayName + " (You)" : "Loading..."}
            username={ownData?.username}
            title={ownData.title || "Loading..."}
            uid={ownData.uid}
            status={statusMap[ownData.uid]}
            unreadMessagesCount={0}
            setCurrentChatData={setCurrentChatData}
            setConversationId={setConversationId}
            selectedChatUid={selectedChatUid}
            setSelectedChatUid={setSelectedChatUid}
            chatMessagesRef={chatMessagesRef}
          />
          {
            friendDatas.length > 0 &&
            friendDatas.map((friendData, index) => {
              return (
                <ChatCard
                  ownUid={ownData.uid}
                  key={index + friendData.uid}
                  displayName={friendData.displayName}
                  username={friendData.username}
                  title={friendData.title}
                  uid={friendData.uid}
                  status={statusMap[friendData.uid]}
                  unreadMessagesCount={
                    Array.isArray(chatMessagesMap[getConversationId(ownData.uid, friendData.uid)]) ?
                      chatMessagesMap[getConversationId(ownData.uid, friendData.uid)]
                      .filter(message => message.isUnread && message.senderId !== ownData.uid)
                      .length
                    : 0
                  }
                  setCurrentChatData={setCurrentChatData}
                  setConversationId={setConversationId}
                  selectedChatUid={selectedChatUid}
                  setSelectedChatUid={setSelectedChatUid}
                  chatMessagesRef={chatMessagesRef}
                />
              )
            })
          }

        </div>
      </div>
      
      <div id="cyber-chats-content">

        <div id="chats-content-top">
          <div className="pfp">
            <img src="/empty-pfp.webp" />
          </div>
          <div className="info">
            <h1>{currentChatData.displayName}</h1>
            <span>{currentChatData.title}</span>
          </div>
        </div>
        
        <div id="chats-content-bottom">

          <div
            ref={chatMessagesRef}
            id="chat-messages"
            className="overflow-y-support"
          >
            {
              hasOlderMessages &&
              <button onClick={loadOlderMessages}>
                Load older messages
              </button>
            }
            { 
              chatMessagesMap[conversationId]?.length > 0 &&
              chatMessagesMap[conversationId].map((chatMessage, index) => {
                return (
                  <MessageCard
                    key={index + chatMessage.id}
                    id={chatMessage.id}
                    isEdited={chatMessage.isEdited}
                    isDeleted={chatMessage.isDeleted}
                    isSending={chatMessage.isSending}
                    senderName={chatUsernamesMap[chatMessage.senderId]}
                    content={chatMessage.content}
                    timeCreated={chatMessage.timeCreated}
                    isUnread={chatMessage.isUnread}
                    isOwnMessage={chatMessage.senderId === ownData.uid}
                    selectedChatUid={selectedChatUid}
                    prevSelectedChatUid={prevSelectedChatUid}
                    conversationId={conversationId}
                  />
                )
              })
            }
          </div>

          <div id="chat-input">
            <input 
              type="text"
              placeholder="Type something.."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addMessage();
              }}
            />
            <button onClick={addMessage}>
              <ArrowLeftSVG />
            </button>
          </div>

        </div>

      </div>

    </div>
  )
}