import { useState } from "react";
import { ThreeDotsSVG } from "../../svg";
import { MessageFeatures } from "./MessageFeatures";
import { EditInput } from "./EditInput";
import { EditedMark } from "./EditedMark";
import { notify } from "../../Notification";
import { previewImage } from "../../ImagePreview";
import { previewAccount } from "../../AccountPreview";

export function MessageCard({ focusMessageInput, conversationId, messageId, isHovered, setHoveredId, setReplyingId, isEditing, setEditingId, setIsDeleting, setDeletingData, setIsReporting, setReportingData, isOwn, isSubset, isReplyingId, isDeleted, isEdited, isSending, senderData, timeCreated, type, content }) {

  const [ isFeaturesVisible, setIsFeaturesVisible ] = useState(false);
  const [ cursorYPos, setCursorYPos ] = useState(null);

  const handleReply = () => {
    setReplyingId(messageId);
    setIsFeaturesVisible(false);
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

  const handleEdit = () => {
    setEditingId(messageId);
    setIsFeaturesVisible(false);
  }

  const handleDelete = () => {
    setIsDeleting(true);
    setDeletingData({
      messageId: messageId,
      timeCreated: timeCreated,
      type: type,
      content: content,
    });
    setIsFeaturesVisible(false);
    setHoveredId(null);
  }

  const handleReport = () => {
    setIsReporting(true);
    setReportingData({
      messageId: messageId,
      pfpUrl: senderData?.pfpUrl,
      displayName: senderData?.displayName,
      timeCreated: timeCreated,
      type: type,
      content: content,
    });
    setIsFeaturesVisible(false);
    setHoveredId(null);
  }

  const handlePreviewAccount = () => {
    previewAccount({
      uid: senderData?.uid,
      pfpUrl: senderData?.pfpUrl,
      displayName: senderData?.displayName,
      username: senderData?.username,
      bio: senderData?.bio,
    });
  }

  return (
    <div
      className="message-card"
      style={{
        backgroundColor: isHovered ? "#27282f" : null,
        marginTop: isSubset && !isReplyingId ? "0px" : null,
        paddingTop: isSubset && !isReplyingId ? "0px" : null
      }}
      onMouseEnter={() => {
        if (!isFeaturesVisible) setHoveredId(messageId);
      }}
      onMouseLeave={() => {
        if (!isFeaturesVisible) setHoveredId(null);
      }}
    >
      
      {
        !isSubset || isReplyingId ?
          <>
            <img
              className="pfp"
              src={senderData?.pfpUrl || "/empty-pfp.webp"}
              onClick={handlePreviewAccount}
            />

            <div className="right">

              <div className="top">
                <span
                  className="name text-overflow-support"
                  onClick={handlePreviewAccount}
                >
                  {senderData?.displayName}
                </span>
                <span className="time">{timeCreated}</span>
              </div>

              {
                isEditing ?

                  <EditInput
                    closeEdit={() => {
                      setEditingId(null);
                      focusMessageInput();
                    }}
                    conversationId={conversationId}
                    messageId={messageId}
                    hasExtraPadding={isSubset && !isReplyingId}
                    content={content}
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
                  closeEdit={() => {
                    setEditingId(null);
                    focusMessageInput();
                  }}
                  conversationId={conversationId}
                  messageId={messageId}
                  hasExtraPadding={isSubset ? true : false}
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
            type={type}
            handleReply={handleReply}
            handleCopyText={handleCopyText}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleReport={handleReport}
          />
        </>
      }

    </div>
  )
}