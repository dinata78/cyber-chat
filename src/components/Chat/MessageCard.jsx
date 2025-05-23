import { useState } from "react";
import { ThreeDotsSVG } from "../svg";
import { MessageFeatures } from "./MessageFeatures";
import { EditInput } from "./EditInput";
import { EditedMark } from "./EditedMark";

export function MessageCard({ conversationId, messageId, isHovered, setHoveredId, isEditing, setEditingId, isOwn, isSubset, isDeleted, isEdited, isSending, senderPfpUrl, senderName, timeCreated, type, content }) {

  const [ isFeaturesVisible, setIsFeaturesVisible ] = useState(false);

  const handleEdit = () => {
    setEditingId(messageId);
    setIsFeaturesVisible(false);
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
              <span className="name">{senderName}</span>
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
                      fontStyle: isDeleted ? "italic" : null
                    }}
                  >
                    {content}

                    {
                      !isDeleted && isEdited &&
                      <EditedMark />
                    }
                  </span>

              : <img className="content" src={content} />
            }

          </div>
        </>
        : <>
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
                  style={{marginLeft: "68px", marginRight: "12px"}}
                >
                  {content}

                  {
                    !isDeleted && isEdited &&
                    <EditedMark />
                  }
                </span>

              : <img
                  className="content"
                  style={{marginLeft: "68px"}}
                  src={content}
                />
            }
          </>
      }

      {
        !isDeleted && !isEditing && isHovered &&
        <div className="three-dots">
          <button onClick={() => setIsFeaturesVisible(true)}>
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
            isOwn={isOwn}
            handleEdit={handleEdit}
          />
        </>
      }

    </div>
  )
}