import { ChatCard } from "./ChatCard";
import { SearchSVG } from "../../svg/SearchSVG";
import { ArrowLeftSVG } from "../../svg/ArrowLeftSVG";
import { MessageCard } from "./MessageCard";
import { useEffect, useRef, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../../firebase";
import { fetchDataFromUid, getConversationId } from "../../../utils";
import { chatCardOnClick } from "./chatCardOnClick";

export function Chats({ ownData, selectedChatUid, setSelectedChatUid, friendListDatas, chatMessagesMap, chatUsernamesMap }) {

  const [conversationId, setConversationId] = useState(null); 
  const [currentChatData, setCurrentChatData] = useState({displayName: "Loading...", title: "Loading...", uid: null});
  const [messageInput, setMessageInput] = useState("");

  const messageEndRef = useRef(null);

  const addMessage = async () => {
    if (!messageInput.trim()) return;

    const conversationId = getConversationId(ownData.uid, currentChatData.uid);
    const messagesRef = collection(db, "conversations", conversationId, "messages");

    await addDoc(messagesRef, {
      content: messageInput,
      senderId: ownData.uid,
      timeCreated: new Date(),
    });

    setMessageInput("");
  }

  useEffect(() => {
    const selectChatOnRender = async () => {
      if (selectedChatUid === "globalChat") {
        chatCardOnClick(
          ownData.uid,
          {displayName: "Global Chat", title: "A global room everyone can access", uid: "globalChat"},
          setCurrentChatData,
          setConversationId,
          setSelectedChatUid
        );
      }
      else {
        const chatData = await fetchDataFromUid(selectedChatUid);  

        chatCardOnClick(
          ownData.uid,
          {displayName: chatData.uid === ownData.uid ? chatData.displayName + " (You)" : chatData.displayName, title: chatData.title, uid: chatData.uid},
          setCurrentChatData,
          setConversationId,
          setSelectedChatUid
        );
      }
    }

    selectChatOnRender();
  }, [ownData.uid]);

  useEffect(() => {
    if (currentChatData.displayName) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

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
            title="A global room everyone can access" 
            uid="globalChat"
            setCurrentChatData={setCurrentChatData}
            setConversationId={setConversationId}
            selectedChatUid={selectedChatUid}
            setSelectedChatUid={setSelectedChatUid}
          />
          {
            ownData.uid != "28qZ6LQQi3g76LLRd20HXrkQIjh1" ?
              <ChatCard 
                ownUid={ownData.uid}
                displayName="Steven Dinata" 
                title="Developer of CyberChat" 
                uid="28qZ6LQQi3g76LLRd20HXrkQIjh1" 
                setCurrentChatData={setCurrentChatData}
                setConversationId={setConversationId}
                selectedChatUid={selectedChatUid}
                setSelectedChatUid={setSelectedChatUid}
              />
            : null
          }
          <ChatCard
            ownUid={ownData.uid}
            displayName={
              ownData.displayName ?
                ownData.displayName + " (You)"
              : "Loading..." 
            }
            title={ownData.title}
            uid={ownData.uid}
            setCurrentChatData={setCurrentChatData}
            setConversationId={setConversationId}
            selectedChatUid={selectedChatUid}
            setSelectedChatUid={setSelectedChatUid}
          />
          {
            friendListDatas.length > 0 &&
            friendListDatas.map((friendData, index) => {
              return (
                <ChatCard
                  ownUid={ownData.uid}
                  key={index + friendData.uid}
                  displayName={friendData.displayName}
                  title={friendData.title}
                  uid={friendData.uid}
                  setCurrentChatData={setCurrentChatData}
                  setConversationId={setConversationId}
                  selectedChatUid={selectedChatUid}
                  setSelectedChatUid={setSelectedChatUid}
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

          <div id="chat-messages" className="overflow-y-support">

            { 
              chatMessagesMap[conversationId] &&
              chatMessagesMap[conversationId].map((chatMessage, index) => {
              return ( 
                <MessageCard
                  key={index + chatMessage.senderId}
                  senderName={chatUsernamesMap[chatMessage.senderId]} 
                  content={chatMessage.content}
                  timeCreated={chatMessage.timeCreated}
                  isOwnMessage={chatMessage.senderId === ownData.uid}
                />
              )
              })
            }

            <div id="message-end-ref" ref={messageEndRef}></div>
          </div>

          <div id="chat-input">
            <input 
              type="text"
              placeholder="Type something.."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
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
