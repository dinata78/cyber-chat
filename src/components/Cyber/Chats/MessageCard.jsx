import { useEffect, useRef, useState } from "react";
import { processDate } from "../../../utils";
import { MoreSVG } from "../../svg/MoreSVG";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

export function MessageCard({ id, isDeleted, isSending, senderName, content, timeCreated, isUnread, isOwnMessage, selectedChatUid, prevSelectedChatUid, conversationId }) {
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  const [featuresContainerPosition, setFeaturesContainerPosition] = useState({top: null, bottom: null, right: null});
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const featuresContainerRef = useRef(null);

  const showFeatures = (e) => {
    let topPosition = null;
    let bottomPosition = null;
    let rightPosition = window.innerWidth - e.clientX + 10;

    if (e.clientY <= window.innerHeight / 2) topPosition = e.clientY + 10;
    else bottomPosition = window.innerHeight - e.clientY + 10;

    setFeaturesContainerPosition({top: topPosition, bottom: bottomPosition, right: rightPosition });
    setIsFeaturesVisible(true);
  }

  const deleteMessage = async () => {
    
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
    }

    else {
      setIsFeaturesVisible(false);

      const currentMessageRef = doc(db, "conversations", conversationId, "messages", id);
  
      const currentMessageDoc = await getDoc(currentMessageRef);
  
      await updateDoc(currentMessageRef, {
        ...currentMessageDoc.data(),
        isDeleted: true,
        content: "This message was deleted.",
      });  
    }

  }

  useEffect(() => {
    const handleMousedown = (e) => {
      if (featuresContainerRef.current && !featuresContainerRef.current.contains(e.target)) {
        setIsFeaturesVisible(false);
      }
    }

    const handleResize = () => {
      setIsFeaturesVisible(false);
    }

    const preventScroll = (e) => {
      e.preventDefault();
    }
    
    if (isFeaturesVisible) {
      document.addEventListener("mousedown", handleMousedown);
      window.addEventListener("resize", handleResize);
      window.addEventListener("wheel", preventScroll, { passive: false });
      window.addEventListener("touchmove", preventScroll, { passive: false });
    }
    else {
      document.removeEventListener("mousedown", handleMousedown);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      setIsConfirmingDelete(false);
    }

    return () => {
      document.removeEventListener("mousedown", handleMousedown);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      setIsConfirmingDelete(false);
    }

  }, [isFeaturesVisible]);

  return (
    <div 
      className="message-card"
      style={{justifyContent: isOwnMessage ? "flex-end" : null}}
    >
      
      <div className="container">

        <div
          className="sender-name"
          style={{alignSelf: isOwnMessage ? "flex-end" : null}}
        >
          {senderName}
        </div>

        <span 
          className="content"
          style={{
            paddingRight: isOwnMessage && !isDeleted ? "50px" : null,
            color: isSending || isDeleted ? "#888" : null,
            fontStyle: isDeleted ? "italic" : null
          }}
        >
          {content}
        </span>

        <div className="time">
          {processDate(timeCreated.toDate())}
        </div>

        {
          !isOwnMessage && isUnread && selectedChatUid !== prevSelectedChatUid.current  &&
          <label className="unread-indicator" title="Unread message">!</label>
        }

        {
          isOwnMessage && !isDeleted &&
          <button className="features-button" onClick={showFeatures}>
            <MoreSVG />
          </button>
        }

      </div>

      {
        isFeaturesVisible &&
        <div 
          className="features-container"
          style={{
            position: "fixed",
            top: featuresContainerPosition.top,
            bottom: featuresContainerPosition.bottom,
            right: featuresContainerPosition.right
          }}
          ref={featuresContainerRef}
        >
          <button>Edit</button>
          <button 
            onClick={deleteMessage}
            style={{
              backgroundColor: isConfirmingDelete ? "#ff000099" : null,
              color: isConfirmingDelete ? "white" : null
            }}
          >
            {!isConfirmingDelete ? "Delete" : "Confirm?"}
          </button>
        </div>
      }
      
    </div>
 )
}