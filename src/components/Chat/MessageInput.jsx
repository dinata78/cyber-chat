import { useRef, useState } from "react";
import { ImageSVG, SendSVG } from "../svg";
import { getConversationId } from "../../utils";
import { db } from "../../../firebase";
import { addDoc, collection } from "firebase/firestore";

export function MessageInput({ messageInputRef, editLastMessage, ownUid, selectedChatUid }) {
  const [ messageValue, setMessageValue ] = useState("");

  const inputContainerRef = useRef(null);

  const conversationId = getConversationId(ownUid, selectedChatUid);

  const resizeInput = () => {
    inputContainerRef.current.style.height = "auto";
    inputContainerRef.current.style.height = `${messageInputRef.current.scrollHeight + 24}px`;
  }

  const inputMessage = (e) => {
    if (e.target.value.length < 10000) {
      setMessageValue(e.target.value);
    }
  }

  const sendMessage = async () => {
    let newMessage = messageValue.trim();

    setMessageValue("");

    requestAnimationFrame(() => {
      resizeInput();
      messageInputRef.current.focus();
    });
    
    if (!newMessage) return;

    const messagesRef = collection(db, "conversations", conversationId, "messages");

    await addDoc(messagesRef, {
      type: "text",
      isEdited: false,
      isDeleted: false,
      content: newMessage,
      senderId: ownUid,
      timeCreated: new Date(),
      isUnread: ["globalChat", ownUid].includes(selectedChatUid) ? false : true,
    });
  }

  return (
    <div className="message-input" ref={inputContainerRef}>
      <button style={{left: "0"}}>
        <ImageSVG />
      </button>

      <textarea
        ref={messageInputRef}
        className="overflow-y-support smaller-scrollbar"
        type="text"
        rows={1}
        placeholder="Type something.."
        value={messageValue}
        onChange={inputMessage}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
          else if (e.key === "ArrowUp") {
            editLastMessage();
          }
        }}
        onInput={resizeInput}
      >
      </textarea>
      
      <button
        style={{right: "0"}}
        onClick={sendMessage}
      >
        <SendSVG />
      </button>
    </div>
  )
}