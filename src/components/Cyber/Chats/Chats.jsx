import { FriendCard } from "./FriendCard";
import { SearchIconSVG } from "../../svg/SearchIconSVG";
import { ArrowLeftIconSVG } from "../../svg/ArrowLeftIconSVG";
import { MessageCard } from "./MessageCard";
import { useEffect, useRef, useState } from "react";
import { addDoc, collection, doc, getDoc, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../../../../firebase";

export function Chats({ isAsideVisible }) {
  const [currentChatData, setCurrentChatData] = useState({});
  const [currentChatContent, setCurrentChatContent] = useState([]);

  const [messageInput,setMessageInput] = useState("");

  const [usernamesMap, setUsernamesMap] = useState([]);

  const messageEndRef = useRef(null);

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
      orderBy("timeCreated", "desc"),
      limit(50),
    );

    const unsubscribe = onSnapshot(messageQuery, async (snapshot) => {
      const messages = snapshot.docs.map((doc) => {return {...doc.data()}});

      const uniqueSenderIds = Array.from(new Set(messages.map((message) => message.senderId)));
      const missingUsernames = uniqueSenderIds.filter((id) => !usernamesMap[id]);

      if (missingUsernames.length > 0) {
        const fetchedNames = {};
        for (const senderId of missingUsernames) {
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

  useEffect(() => {
    if (currentChatData.name) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  })

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
                <SearchIconSVG />
              </div>
              <input type="text" placeholder="Search" />
            </div>
          </div>

        </div>
        <div id="chats-aside-bottom">
          <FriendCard 
            currentChatName={currentChatData.name} 
            friendName="Global Chat" 
            friendTitle="A global room everyone can access." 
            friendUid="GlobalChat" 
            onFriendCardClick={onFriendCardClick} 
          />
          <FriendCard 
            currentChatName={currentChatData.name} 
            friendName="Steven Dinata" 
            friendTitle="Developer of CyberChat" 
            friendUid="28qZ6LQQi3g76LLRd20HXrkQIjh1" 
            onFriendCardClick={onFriendCardClick} 
          />
        </div>
      </div>
      }
      
      {currentChatData.name ?
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
          <div id="chat-display">
            {currentChatContent.map((chatContent, index) => {
            return <MessageCard
                      key={index + chatContent.senderId}
                      senderName={usernamesMap[chatContent.senderId]} 
                      content={chatContent.content} 
                      isOwnMessage={chatContent.senderId === auth.currentUser.uid}
                   />
            })}
            <div id="message-end-ref" ref={messageEndRef}></div>
          </div>
          
          <div id="chat-input">
            <input type="text" placeholder="Type something.." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
            <button onClick={() => addMessage(messageInput)}>
              <ArrowLeftIconSVG />
            </button>
          </div>

        </div>
      </div>
      : null
      }
    </div>
  )
}