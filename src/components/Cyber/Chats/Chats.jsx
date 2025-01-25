import { ChatCard } from "./ChatCard";
import { SearchSVG } from "../../svg/SearchSVG";
import { ArrowLeftSVG } from "../../svg/ArrowLeftSVG";
import { MessageCard } from "./MessageCard";
import { useEffect, useRef, useState } from "react";
import { addDoc, collection, doc, getDoc, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../../../firebase";
import { getConversationId } from "../../../utils";

export function Chats({ ownData, isAsideVisible }) {
  const [currentChatData, setCurrentChatData] = useState({});
  const [currentChatContent, setCurrentChatContent] = useState([]);

  const [messageInput,setMessageInput] = useState("");
  const [usernamesMap, setUsernamesMap] = useState({});

  const messageEndRef = useRef(null);

  const unsubscribeSnapshot = useRef(null);

  const onChatCardClick = (name, title, uid) => {
    if (!ownData.uid) return;

    setCurrentChatData({
      name: name,
      title: title,
      uid: uid, 
    });

    if (unsubscribeSnapshot.current) {
      unsubscribeSnapshot.current();
    }

    const conversationId = getConversationId(ownData.uid, uid);

    const messageQuery = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("timeCreated", "desc"),
      limit(50),
    );

    const unsubscribe = onSnapshot(messageQuery, async (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({...doc.data()}));

      const uniqueSenderIds = Array.from(new Set(messages.map((message) => message.senderId)));
      const missingUsernameIds = uniqueSenderIds.filter((id) => !usernamesMap[id]);

      if (missingUsernameIds.length > 0) {
        const fetchedNames = {};
        for (const senderId of missingUsernameIds) {
          const userDoc = await getDoc(doc(db, "users", senderId));
          if (userDoc.exists()) {
            fetchedNames[senderId] = userDoc.data().name;
          }
        }
        setUsernamesMap((prev) => ({...prev, ...fetchedNames}));
      }

      setCurrentChatContent(messages.reverse());
    });

    unsubscribeSnapshot.current = unsubscribe;
  }

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
    if (currentChatData.name) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  return (
    <div id="cyber-chats">

      {isAsideVisible &&
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
              type="special"
              currentChatName={currentChatData.name} 
              name="Global Chat" 
              title="A global room everyone can access." 
              uid="globalChat"
              onChatCardClick={onChatCardClick} 
            />
            <ChatCard 
              type="special"
              currentChatName={currentChatData.name}
              name={ownData.name + " (You)"}
              title={ownData.title}
              uid={ownData.uid}
              onChatCardClick={onChatCardClick}
            />
            {
              ownData.uid != "28qZ6LQQi3g76LLRd20HXrkQIjh1" ?
                <ChatCard 
                  currentChatName={currentChatData.name} 
                  name="Steven Dinata" 
                  title="Developer of CyberChat" 
                  uid="28qZ6LQQi3g76LLRd20HXrkQIjh1" 
                  onChatCardClick={onChatCardClick}
                />
              : null
            }

          </div>
          
        </div>
      }
      
      {
        currentChatData.name ?
          <div id="cyber-chats-content">

            <div id="chats-content-top">
              <div id="chats-content-top-pfp">
                <img src="/empty-pfp.webp" />
              </div>
              <div id="chats-content-top-info">
                <h1>{currentChatData.name}</h1>
                <span>{currentChatData.title}</span>
              </div>
            </div>
            
            <div id="chats-content-bottom">
              <div id="chat-display" className="overflow-y-support">
                {currentChatContent.map((chatContent, index) => {
                return <MessageCard
                          key={index + chatContent.senderId}
                          senderName={usernamesMap[chatContent.senderId]} 
                          content={chatContent.content} 
                          isOwnMessage={chatContent.senderId === ownData.uid}
                      />
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
                <button onClick={() => addMessage(messageInput)}>
                  <ArrowLeftSVG />
                </button>
              </div>
            </div>

          </div>
        : null
      }
    </div>
  )
}