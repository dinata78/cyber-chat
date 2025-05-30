import { useState } from "react";
import { ThreeDotsSVG } from "../svg";
import { MessageFeatures } from "./MessageFeatures";
import { EditInput } from "./EditInput";
import { EditedMark } from "./EditedMark";
import { notify } from "../Notification";
import { previewImage } from "../ImagePreview";

export function MessageCard({ conversationId, messageId, isHovered, setHoveredId, isEditing, setEditingId, setIsDeleting, setDeletingData, isOwn, isSubset, isDeleted, isEdited, isSending, senderPfpUrl, senderName, timeCreated, type, content }) {

  const [ isFeaturesVisible, setIsFeaturesVisible ] = useState(false);
  const [ cursorYPos, setCursorYPos ] = useState(null);

  const handleEdit = () => {
    setEditingId(messageId);
    setIsFeaturesVisible(false);
  }

  const handleDelete = () => {
    setIsDeleting(true);
    setDeletingData({
      id: messageId,
      timeCreated: timeCreated,
      type: type,
      content: content,
    });
    setIsFeaturesVisible(false);
    setHoveredId(null);
  }

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(content);
      notify("text-copied", "Copied text to clipboard!");
    }
    catch {
      console.error("Error: Failed to copy text.");
      notify(null, "Failed to copy text.");
    }
    finally {
      setIsFeaturesVisible(false);
    }
  }

  return (
    <div
      className="message-card"
      style={{
        backgroundColor: isHovered ? "#27282f" : null,
        marginTop: isSubset ? "0px" : null,
        paddingTop: isSubset ? "0px" : null
      }}
      onMouseEnter={() => {
        if (!isFeaturesVisible) setHoveredId(messageId);
      }}
      onMouseLeave={() => {
        if (!isFeaturesVisible) setHoveredId(null);
      }}
    >

      {
        !isSubset ?
        <>
          <img className="pfp" src={senderPfpUrl || "/empty-pfp.webp"} />

          <div className="right">

            <div className="top">
              <span className="name text-overflow-support">{senderName}</span>
              <span className="time">{timeCreated}</span>
            </div>

            {
              isEditing ?

                <EditInput
                  conversationId={conversationId}
                  messageId={messageId}
                  isSubset={isSubset}
                  content={content}
                  closeEdit={() => setEditingId(null)}
                />

              : type === "text" ?

                  <span
                    className="content"
                    style={{
                      color: isSending || isDeleted ? "#a1a5ad" : null,
                      fontStyle: isDeleted && "italic"
                    }}
                  >
                    {!isDeleted ? content : "This message was deleted."}

                    {
                      !isDeleted && isEdited &&
                      <EditedMark />
                    }
                  </span>

              : <img
                  tabIndex={0}
                  className="content"
                  src={content}
                  onClick={() => previewImage(content)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") previewImage(content);
                  }}
                />
            }

          </div>
        </>
        : <>
            {
              isEditing ?

                <EditInput
                  closeEdit={() => setEditingId(null)}
                  conversationId={conversationId}
                  messageId={messageId}
                  isSubset={isSubset}
                  content={content}
                />

              : type === "text" ?

                <span
                  className="content"
                  style={{
                    marginLeft: "68px",
                    marginRight: "12px",
                    color: isSending || isDeleted ? "#a1a5ad" : null,
                    fontStyle: isDeleted && "italic"
                  }}
                >
                  {!isDeleted ? content : "This message was deleted."}

                  {
                    !isDeleted && isEdited &&
                    <EditedMark />
                  }
                </span>

              : <img
                  tabIndex={0}
                  className="content"
                  style={{marginLeft: "68px"}}
                  src={content}
                  onClick={() => previewImage(content)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") previewImage(content);
                  }}
                />
            }
          </>
      }

      {
        !isDeleted && !isEditing && isHovered &&
        <div className="three-dots">
          <button
            onClick={(e) => {
              setIsFeaturesVisible(true);
              setCursorYPos(e.clientY);
            }}
          >
            <ThreeDotsSVG />
          </button>
        </div>
      }

      {
        isFeaturesVisible &&
        <>
          <div
            className="overlay"
            onClick={() => {setIsFeaturesVisible(false);}}
          >
          </div>
          
          <MessageFeatures
            cursorYPos={cursorYPos}
            isOwn={isOwn}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleCopyText={handleCopyText}
          />
        </>
      }

    </div>
  )
}