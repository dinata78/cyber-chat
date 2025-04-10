import { useEffect, useRef, useState } from "react";
import { deleteImageFromDb, normalizeSpaces, processDate, setCursorPosition } from "../../../utils";
import { MoreSVG } from "../../svg/MoreSVG";
import { CheckSVG } from "../../svg/CheckSVG";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { ImagePreview } from "../../ImagePreview";

export function MessageCard({ id, type, isEdited, isDeleted, isSending, senderName, content, timeCreated, isUnread, isOwnMessage, selectedChatUid, prevSelectedChatUid, conversationId }) {
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  const [featuresContainerPosition, setFeaturesContainerPosition] = useState({top: null, bottom: null, right: null});
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const [isPreviewingImage, setIsPreviewingImage] = useState(false);
  const [isPreviewFit, setIsPreviewFit] = useState(true);
  const [imageData, setImageData] = useState({ width: 0, height: 0 });

  const featuresContainerRef = useRef(null);
  const contentRef= useRef(null);

  const showFeatures = (e) => {
    let topPosition = null;
    let bottomPosition = null;
    let rightPosition = window.innerWidth - e.clientX;

    if (e.clientY <= window.innerHeight / 2) topPosition = e.clientY;
    else bottomPosition = window.innerHeight - e.clientY;

    setFeaturesContainerPosition({
      top: topPosition,
      bottom: bottomPosition,
      right: rightPosition
    });

    setIsFeaturesVisible(true);
  }

  const deleteMessage = async () => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
    }
    else {
      setIsFeaturesVisible(false);

      const currentMessageRef = doc(db, "conversations", conversationId, "messages", id);

      if (type === "image") {
        const success = await deleteImageFromDb(content);

        if (!success) {
          console.error("Error: Failed to delete image.");
          return;
        }
      }
      
      await updateDoc(currentMessageRef, {
        isDeleted: true,
        type: "text",
        content: "This message was deleted.",
      });  
    }
  }

  const editMessage = async () => {
    if (!isEditing) {
      setIsFeaturesVisible(false);
      setIsEditing(true);

      requestAnimationFrame(() => {
        setCursorPosition(contentRef, "end");
      });
    }
    else {
      setIsEditing(false);

      const filteredEditedContent = normalizeSpaces(editedContent);

      if (!filteredEditedContent) {
        setEditedContent(content);
        return;
      }

      if (filteredEditedContent !== content) {
        const currentMessageRef = doc(db, "conversations", conversationId, "messages", id);
  
        await updateDoc(currentMessageRef, {
          isEdited: true,
          content: filteredEditedContent,
        });
      }

      setEditedContent(filteredEditedContent)
    }
  }

  const inputContent = (e) => {
    const offset = window.getSelection().getRangeAt(0).startOffset;

    setEditedContent(e.target.innerText);

    requestAnimationFrame(() => {
      setCursorPosition(contentRef, offset);
    });
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

  useEffect(() => {
    if (type === "image") {
      const img = new Image();
      img.src = content;
      
      img.onload = () => {
        setImageData({ width: img.width, height: img.height });
      }
    }
  }, []);

  return (
    <div 
      className="message-card"
      style={{justifyContent: isOwnMessage ? "flex-end" : null}}
    >
      
      <div
        className="container"
        style={{width: type === "image" ? "max-content" : null}}
      >

        <div
          className="sender-name"
          style={{alignSelf: isOwnMessage ? "flex-end" : null}}
        >
          {senderName}
        </div>

        {
          type === "text" ?
            <span 
            contentEditable={isEditing}
            suppressContentEditableWarning
            className="content"
            style={{
              paddingRight: isOwnMessage && !isDeleted ? "50px" : null,
              border: isEditing ? "1px solid white" : null,
              color: isOwnMessage && isSending || isDeleted ? "#888" : null,
              fontStyle: isDeleted ? "italic" : null
            }}
            ref={contentRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                editMessage();
              }
            }}
            onInput={inputContent}
          >
            {!isEditing ? content : editedContent}
          </span>
        : <img 
            src={content}
            className="content"
            onClick={() => setIsPreviewingImage(true)}
          />
        }


        <div className="time" onClick={() => contentRef.current.focus()}>
          {isEdited && "*EDITED*"} {processDate(timeCreated.toDate())}
        </div>

        {
          !isOwnMessage && isUnread && selectedChatUid !== prevSelectedChatUid.current  &&
          <label className="unread-indicator" title="Unread message">!</label>
        }

        {
          isOwnMessage && !isDeleted &&
          <button
            className="features-button"
            style={{padding: isEditing ? "12px" : null}}
            onClick={isEditing ? editMessage : showFeatures}
          >
            {isEditing ? <CheckSVG /> : <MoreSVG />}
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
          {type === "text" && <button onClick={editMessage}>Edit</button>}
          
          <button 
            onClick={deleteMessage}
            style={{
              backgroundColor: isConfirmingDelete ? "#ff000050" : null,
              color: isConfirmingDelete ? "white" : null
            }}
          >
            {!isConfirmingDelete ? "Delete" : "Confirm?"}
          </button>
        </div>
      }

      {
        isPreviewingImage &&
        <ImagePreview
          url={content}
          width={imageData.width}
          height={imageData.height}
          isPreviewFit={isPreviewFit}
          setIsPreviewFit={setIsPreviewFit}
          closePreview={() => setIsPreviewingImage(false)}
        />
      }
      
    </div>
 )
}