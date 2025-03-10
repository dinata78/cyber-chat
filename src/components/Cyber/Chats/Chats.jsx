import { ChatCard } from "./ChatCard";
import { SearchSVG } from "../../svg/SearchSVG";
import { ArrowLeftSVG } from "../../svg/ArrowLeftSVG";
import { MessageCard } from "./MessageCard";
import { useEffect, useRef, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../../firebase";
import { fetchDataFromUid, getConversationId } from "../../../utils";
import { onChatCardClick } from "./onChatCardClick";

export function Chats({ ownData, selectedChatUid, setSelectedChatUid, friendListDatas }) {
  const [currentChatData, setCurrentChatData] = useState({displayName: "Loading...", title: "Loading...", uid: null});
  const [currentChatContent, setCurrentChatContent] = useState([]);
  const [messageInput,setMessageInput] = useState("");
  const [usernamesMap, setUsernamesMap] = useState({});

  const messageEndRef = useRef(null);

  const unsubscribeSnapshot = useRef(null);

  const addMessage = async (newMessage) => {
    if (!newMessage.trim()) return;

    const conversationId = getConversationId(ownData.uid, currentChatData.uid);
    const collectionRef = collection(db, "conversations", conversationId, "messages");

    await addDoc(collectionRef, {
      content: newMessage,
      senderId: ownData.uid,
      timeCreated: new Date(),
    });

    setMessageInput("");
  }

  useEffect(() => {
    const selectChatOnFirstRender = async () => {
      if (selectedChatUid === "globalChat") {
        onChatCardClick(
          "Global Chat",
          "A global room everyone can access",
          "globalChat",
          ownData.uid,
          setCurrentChatData,
          setCurrentChatContent,
          usernamesMap,
          setUsernamesMap,
          unsubscribeSnapshot,
          setSelectedChatUid
        )  
      }
      else {
        const data = await fetchDataFromUid(selectedChatUid);  

        onChatCardClick(
          data.uid === ownData.uid ?
            data.displayName + " (You)"
          : data.displayName,
          data.title,
          data.uid,
          ownData.uid,
          setCurrentChatData,
          setCurrentChatContent,
          usernamesMap,
          setUsernamesMap,
          unsubscribeSnapshot,
          setSelectedChatUid
        )
      }
    }

    selectChatOnFirstRender();
  }, [ownData])

  useEffect(() => {
    if (currentChatData.displayName) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });


  return (
    <div id="cyber-chats">
      <div id="cyber-chats-aside">

        <div id="chats-aside-top">
          <div id="chats-aside-top-top">
            <h1>Chats</h1>
          </div>
          <div id="chats-aside-top-bottom">
            <div id="chats-aside-search">
              <div>
                <SearchSVG />
              </div>
              <input type="text" placeholder="Search" />
            </div>
          </div>
        </div>

        <div id="chats-aside-bottom" className="overflow-y-support">
          <ChatCard
            displayName="Global Chat" 
            title="A global room everyone can access" 
            uid="globalChat"
            ownUid={ownData.uid}
            setCurrentChatData={setCurrentChatData}
            setCurrentChatContent={setCurrentChatContent}
            usernamesMap={usernamesMap}
            setUsernamesMap={setUsernamesMap}
            unsubscribeSnapshot={unsubscribeSnapshot}
            selectedChatUid={selectedChatUid}
            setSelectedChatUid={setSelectedChatUid}
          />
          {
            ownData.uid != "28qZ6LQQi3g76LLRd20HXrkQIjh1" ?
              <ChatCard 
                displayName="Steven Dinata" 
                title="Developer of CyberChat" 
                uid="28qZ6LQQi3g76LLRd20HXrkQIjh1" 
                ownUid={ownData.uid}
                setCurrentChatData={setCurrentChatData}
                setCurrentChatContent={setCurrentChatContent}
                usernamesMap={usernamesMap}
                setUsernamesMap={setUsernamesMap} 
                unsubscribeSnapshot={unsubscribeSnapshot}
                selectedChatUid={selectedChatUid}
                setSelectedChatUid={setSelectedChatUid}
              />
            : null
          }
          <ChatCard 
            displayName={
              ownData.displayName ?
                ownData.displayName + " (You)"
              : "Loading..." 
            }
            title={ownData.title}
            uid={ownData.uid}
            ownUid={ownData.uid}
            setCurrentChatData={setCurrentChatData}
            setCurrentChatContent={setCurrentChatContent}
            usernamesMap={usernamesMap}
            setUsernamesMap={setUsernamesMap}
            unsubscribeSnapshot={unsubscribeSnapshot}
            selectedChatUid={selectedChatUid}
            setSelectedChatUid={setSelectedChatUid}
          />
          {
            friendListDatas.map((friendData, index) => {
              return (
                <ChatCard
                  key={index + friendData.uid}
                  displayName={friendData.displayName}
                  title={friendData.title}
                  uid={friendData.uid}
                  ownUid={ownData.uid}
                  setCurrentChatData={setCurrentChatData}
                  setCurrentChatContent={setCurrentChatContent}
                  usernamesMap={usernamesMap}
                  setUsernamesMap={setUsernamesMap} 
                  unsubscribeSnapshot={unsubscribeSnapshot}
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
          <div id="chats-content-top-pfp">
            <img src="/empty-pfp.webp" />
          </div>
          <div id="chats-content-top-info">
            <h1>{currentChatData.displayName}</h1>
            <span>{currentChatData.title}</span>
          </div>
        </div>
        
        <div id="chats-content-bottom">
          <div id="chat-messages" className="overflow-y-support">
            {currentChatContent.map((chatContent, index) => {
            return ( 
              <MessageCard
                key={index + chatContent.senderId}
                senderName={usernamesMap[chatContent.senderId]} 
                content={chatContent.content}
                timeCreated={chatContent.timeCreated}
                isOwnMessage={chatContent.senderId === ownData.uid}
              />
            )
            })}
            <div id="message-end-ref" ref={messageEndRef}></div>
          </div>
          <div id="chat-input">
            <input 
              type="text"
              placeholder="Type something.."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button
              onClick={() => addMessage(messageInput)}
            >
              <ArrowLeftSVG />
            </button>
          </div>
        </div>

      </div>

    </div>
  )
}