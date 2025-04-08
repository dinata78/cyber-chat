import { ChatCard } from "./ChatCard";
import { SearchSVG } from "../../svg/SearchSVG";
import { SendSVG } from "../../svg/SendSVG";
import { ImageSVG } from "../../svg/ImageSVG";
import { EyeSVG } from "../../svg/EyeSVG"
import { MessageCard } from "./MessageCard";
import { useEffect, useRef, useState } from "react";
import { addDoc, collection, getDocs, query, where, writeBatch } from "firebase/firestore";
import { db } from "../../../../firebase";
import { fetchDataFromUid, getConversationId, normalizeSpaces } from "../../../utils";
import { chatCardOnClick } from "./chatCardOnClick";
import { useStatusByUid } from "../../../custom-hooks/useStatusByUid";

export function Chats({ ownData, selectedChatUid, setSelectedChatUid, friendDatas, devData, chatMessagesMap, chatUsernamesMap, messagesAmountMap, setMessagesAmountMap, statusMap }) {

  const [conversationId, setConversationId] = useState(null); 
  const [messageInput, setMessageInput] = useState("");
  const [hasOlderMessages, setHasOlderMessages] = useState(false);
  const [chosenImage, setChosenImage] = useState(null);
  const [chosenImageData, setChosenImageData] = useState({ name: "", url: "", width: 0, height: 0 });
  const [isPreviewingImage, setIsPreviewingImage] = useState(false);
  const [isPreviewFit, setIsPreviewFit] = useState(false);

  const { status } = useStatusByUid(ownData.uid);

  const [friendDisplayNameMap, friendTitleMap, friendPfpUrlMap] = (() => {
    const displayNameMap = {};
    const titleMap = {};
    const pfpUrlMap = {};

    friendDatas.forEach(friendData => {
      displayNameMap[friendData.uid] = friendData.displayName;
      titleMap[friendData.uid] = friendData.title;
      pfpUrlMap[friendData.uid] = friendData.pfpUrl;
    });

    return [ displayNameMap, titleMap, pfpUrlMap ];
  })();

  const selectedChatMessages = chatMessagesMap[conversationId];
  const selectedChatMessagesMaxAmount = messagesAmountMap[conversationId] || messagesAmountMap["default"];

  const latestMessageId = selectedChatMessages ? selectedChatMessages[selectedChatMessages.length - 1]?.id : undefined;

  const prevSelectedChatUid = useRef("");
  
  const chatMessagesRef = useRef(null);
  const imageInputRef = useRef(null);

  const sendMessage = async () => {
    const newMessage = chosenImageData.url || normalizeSpaces(messageInput) || null;
    setMessageInput("");
    if (chosenImage) clearChosenImage();
    
    if (!newMessage) return;

    if (selectedChatMessages.length === selectedChatMessagesMaxAmount) {
      setMessagesAmountMap(prev => {
        const prevMessagesAmountMap = {...prev};
  
        prevMessagesAmountMap[conversationId] = selectedChatMessagesMaxAmount + 1;
  
        return prevMessagesAmountMap;
      });
    }

    const messagesRef = collection(db, "conversations", conversationId, "messages");

    await addDoc(messagesRef, {
      type: chosenImageData.url ? "image" : "text",
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

  const clearChosenImage = () => {
    imageInputRef.current.value = null;
    setChosenImage(null);
    setChosenImageData({ name: "", url: "", width: 0, height: 0 });
  }

  useEffect(() => {
    const selectChatOnRender = async () => {
      if (selectedChatUid === "globalChat") {
        chatCardOnClick({
          ownUid: ownData.uid,
          chatUid: "globalChat",
          setConversationId: setConversationId,
          selectedChatUid: null,
          setSelectedChatUid: setSelectedChatUid,
          chatMessagesRef: chatMessagesRef,
      });
      }
      else if (selectedChatUid === devData.uid) {
        chatCardOnClick({
          ownUid: ownData.uid,
          chatUid: devData.uid,
          setConversationId: setConversationId,
          selectedChatUid: null,
          setSelectedChatUid: setSelectedChatUid,
          chatMessagesRef: chatMessagesRef,
      });
      }
      else {
        const chatData = await fetchDataFromUid(selectedChatUid);

        chatCardOnClick({
          ownUid: ownData.uid,
          chatUid: chatData.uid,
          setConversationId: setConversationId,
          selectedChatUid: null,
          setSelectedChatUid: setSelectedChatUid,
          chatMessagesRef: chatMessagesRef
        });
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

  useEffect(() => {
    let revokeURL = null;

    if (chosenImage) {
      if (chosenImage.size > 5 * 1000 * 1000) {
        setErrorInfo("Image size should be less than 10MB.");
        clearChosenImage();
      }
      else {
        const url = URL.createObjectURL(chosenImage);
        revokeURL = () => URL.revokeObjectURL(url);

        const img = new Image();
        img.src = url;
        
        img.onload = () => {
          setChosenImageData({
            url: url,
            name: `${chosenImage.name} (image)`,
            width: img.width,
            height: img.height,
          });
        }
      }
    }

    return () => {
      if (revokeURL) revokeURL();
    }
  }, [chosenImage])

  useEffect(() => {
    console.log(chosenImageData)
  }, [chosenImageData])

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
            status="online"
            pfpUrl={null}
            unreadMessagesCount={0}
            setConversationId={setConversationId}
            selectedChatUid={selectedChatUid}
            setSelectedChatUid={setSelectedChatUid}
            chatMessagesRef={chatMessagesRef}
          />
          {
            ownData.uid != devData.uid ?
              <ChatCard 
                ownUid={ownData.uid}
                displayName={devData.displayName || "Loading..."}
                username={devData.username}
                title={devData.title || "Loading..."} 
                uid={devData.uid}
                status={statusMap[devData.uid]}
                pfpUrl={devData.pfpUrl}
                unreadMessagesCount={
                  Array.isArray(chatMessagesMap[getConversationId(ownData.uid, devData.uid)]) ?
                    chatMessagesMap[getConversationId(ownData.uid, devData.uid)]
                    .filter(message => message.isUnread && message.senderId !== ownData.uid)
                    .length
                  : 0
                }
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
            status={status}
            pfpUrl={ownData.pfpUrl}
            unreadMessagesCount={0}
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
                  pfpUrl={friendData.pfpUrl}
                  unreadMessagesCount={
                    Array.isArray(chatMessagesMap[getConversationId(ownData.uid, friendData.uid)]) ?
                      chatMessagesMap[getConversationId(ownData.uid, friendData.uid)]
                      .filter(message => message.isUnread && message.senderId !== ownData.uid)
                      .length
                    : 0
                  }
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
            <img 
              src={
                selectedChatUid === "globalChat" ? "/globe.webp"
                : selectedChatUid === devData.uid ? devData.pfpUrl || "/empty-pfp.webp"
                : selectedChatUid === ownData.uid ? ownData.pfpUrl || "/empty-pfp.webp"
                : friendPfpUrlMap[selectedChatUid] || "/empty-pfp.webp"
              }
            />
          </div>
          <div className="info">
            <h1>
              {
                selectedChatUid === "globalChat" ? "Global Chat"
                : selectedChatUid === devData.uid ? devData.displayName || "Loading..."
                : selectedChatUid === ownData.uid ? `${ownData.displayName} (You)` || "Loading..."
                : friendDisplayNameMap[selectedChatUid] || "Loading..."
              }
            </h1>
            <span>
              {
                selectedChatUid === "globalChat" ? "A global room everyone can access"
                : selectedChatUid === devData.uid ? devData.title || "Loading..."
                : selectedChatUid === ownData.uid ? ownData.title || "Loading..."
                : friendTitleMap[selectedChatUid] || "Loading..."
              }
            </span>
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
                    type={chatMessage.type}
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
            <button
              className="add-image"
              onClick={() => imageInputRef.current.click()}
            >
              <ImageSVG />
            </button>

            <input
              ref={imageInputRef}
              type="file"
              style={{display: "none", pointerEvents: "none"}}
              accept="image/jpg, image/jpeg, image/png, image/webp"
              onChange={(e) => setChosenImage(e.target.files[0])}
            />

            <input
              type="text"
              style={{
                color: chosenImageData.name ? "#aaddff99" : null,
                paddingRight: chosenImageData.name ? "135px" : null
              }}
              placeholder="Type something.."
              value={chosenImageData.name || messageInput}
              onChange={(e) => {
                if (!chosenImageData.name) setMessageInput(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
                if (chosenImageData.name && e.key === "Backspace") {
                  clearChosenImage();
                  setMessageInput("");
                }
              }}
            />

            {
              chosenImageData.name &&
              <button className="preview-image" onClick={() => setIsPreviewingImage(true)}>
                <EyeSVG />
                Preview
              </button>
            }

            <button className="add-message" onClick={sendMessage}>
              <SendSVG />
            </button>

          </div>

        </div>

      </div>

      {
        isPreviewingImage &&
        <div
          className="image-preview"
          onClick={() => {
            setIsPreviewingImage(false);
            setIsPreviewFit(false);
          }}
        >
          <div className="extras" onClick={(e) => e.stopPropagation()}>
            <span>
              Actual Size: {chosenImageData.width} x {chosenImageData.height}
            </span>
            <label>
              <input type="checkbox" onChange={() => setIsPreviewFit(prev => !prev)} />
              Fit to screen
            </label>
          </div>
          <img
            style={{
              maxWidth: isPreviewFit ? "80vw" : null,
              maxHeight: isPreviewFit ? "80vh" : null
            }}
            src={chosenImageData.url}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      }

    </div>
  )
}