import { FriendCard } from "./FriendCard";
import { PlusIconSVG } from "../../svg/PlusIconSVG";
import { SearchIconSVG } from "../../svg/SearchIconSVG";
import { ArrowLeftIconSVG } from "../../svg/ArrowLeftIconSVG";
import { MessageCard } from "./MessageCard";
import { useEffect, useRef, useState } from "react";
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../../../../firebase";

export function Chats() {
  const [currentChat, setCurrentChat] = useState(null);
  const [currentChatData, setCurrentChatData] = useState({});
  const [currentChatContent, setCurrentChatContent] = useState([]);

  const [messageInput,setMessageInput] = useState("");

  const [usernamesMap, setUsernamesMap] = useState([]);

  const getConversationId = (ownUid, friendUid) => {
    if (ownUid === friendUid) return ownUid;

    const mergeUids = (a, b) => {
      let i = 0;
      while (true) {
        const aCharCode = a.charCodeAt(i);
        const bCharCode = b.charCodeAt(i);
        
        if (aCharCode < bCharCode) return a + b;
        else if (aCharCode > bCharCode) return b + a;
        else {
          i++;
        }  
      }
    }

    if (friendUid === "GlobalChat") return "GlobalChat";
    else return mergeUids(ownUid, friendUid);
  };

  const unsubscribeSnapshot = useRef(null);

  const onFriendCardClick = (friendName, friendTitle, friendUid) => {
    setCurrentChat(friendName);
    setCurrentChatData({
      name: friendName,
      title: friendTitle,
      uid: friendUid, 
    });

    if (unsubscribeSnapshot.current) {
      unsubscribeSnapshot.current();
    }

    const conversationId = getConversationId(auth.currentUser.uid, friendUid);

    const messageQuery = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("timeCreated", "asc"),
    );

    const unsubscribe = onSnapshot(messageQuery, async (snapshot) => {
      const messages = snapshot.docs.map((doc) => {return {...doc.data()}});

      const uniqueSenderIds = Array.from(new Set(messages.map((msg) => msg.senderId)));
    const fetchMissingUsernames = uniqueSenderIds.filter((id) => !usernamesMap[id]);

    if (fetchMissingUsernames.length > 0) {
      const fetchedNames = {};
      for (const senderId of fetchMissingUsernames) {
        const userDoc = await getDoc(doc(db, "users", senderId));
        if (userDoc.exists()) {
          fetchedNames[senderId] = userDoc.data().name;
        }
      }
      setUsernamesMap((prev) => ({ ...prev, ...fetchedNames }));
    }


      setCurrentChatContent(messages);
    });

    unsubscribeSnapshot.current = unsubscribe;
  }

  const addMessage = async (message) => {
    const conversationId = getConversationId(auth.currentUser.uid, currentChatData.uid);
    const collectionRef = collection(db, "conversations", conversationId, "messages");

    console.log(conversationId)

    await addDoc(collectionRef, {
      content: message,
      senderId: auth.currentUser.uid,
      timeCreated: new Date(),
    });

    setMessageInput("");
  }

  return (
    <div id="cyber-chats-container">
      <div id="cyber-chats-main">
        <div id="chat-header">

          <div id="chat-header-top">
            <h1>Chats</h1>
            <button id="chat-add-button">
                <PlusIconSVG />
            </button>
          </div>
          
          <div id="chat-header-bottom">
            <div id="chat-search">
              <div id="chat-search-icon-container">
                <SearchIconSVG />
              </div>
              <input id="chat-search-input" type="text" placeholder="Search" />
            </div>
          </div>

        </div>
        <div id="friend-list">
          <FriendCard 
            currentChat={currentChat} 
            friendName="Global Chat" 
            friendTitle="A global room everyone can access." 
            friendUid="GlobalChat" 
            onFriendCardClick={onFriendCardClick} 
          />
          <FriendCard 
            currentChat={currentChat} 
            friendName="Steven Dinata" 
            friendTitle="Developer of CyberChat" 
            friendUid="28qZ6LQQi3g76LLRd20HXrkQIjh1" 
            onFriendCardClick={onFriendCardClick} 
          />
        </div>
      </div>

      <div id="cyber-chats-content">
        <div id="chats-content-top">
          <div id="current-chat-pfp-container">
            <img id="current-chat-pfp" src="/empty-pfp.webp" />
          </div>
          <div id="current-chat-info">
            <span id="current-chat-name">{currentChatData.name}</span>
            <span id="current-chat-title">{currentChatData.title}</span>
          </div>
        </div>

        <div id="chats-content-bottom">
          <div id="chat-display">
            {currentChatContent.map((chatContent, index) => {
            return <MessageCard
                      key={index + chatContent.senderId}
                      senderName={usernamesMap[chatContent.senderId]} 
                      content={chatContent.content} 
                      isOwnMessage={chatContent.senderId === auth.currentUser.uid}
                   />
            })}
          </div>
          
          <div id="chat-input">
            <input type="text" placeholder="Type something.." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
            <button onClick={() => addMessage(messageInput)}>
              <ArrowLeftIconSVG />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}