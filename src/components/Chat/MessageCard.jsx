import { useEffect, useRef, useState } from "react";
import { ThreeDotsSVG } from "../svg";
import { useAutoHideFeatures } from "../../custom-hooks/useAutoHideFeatures";
import { MessageFeatures } from "./MessageFeatures";

export function MessageCard({ isOwn, isSubset, isDeleted, isEdited, isSending, senderPfpUrl, senderName, timeCreated, type, content }) {

  const [ isHovered, setIsHovered ] = useState(false);
  const [ isFeaturesVisible, setIsFeaturesVisible ] = useState(false);

  // useAutoHideFeatures(featuresRef, isFeaturesVisible, setIsFeaturesVisible);

  return (
    <div
      className="message-card"
      style={{
        backgroundColor: isHovered ? "#27282f" : null,
        marginTop: isSubset ? "0px" : null,
        paddingTop: isSubset ? "0px" : null
      }}
      onMouseEnter={() => {
        if (!isFeaturesVisible) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (!isFeaturesVisible) setIsHovered(false);
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
              type === "text" ?
                <span
                  className="content"
                  style={{
                    color: isSending || isDeleted ? "#a1a5ad" : null,
                    fontStyle: isDeleted ? "italic" : null
                  }}
                >
                  {content}

                  {!isDeleted && isEdited && " "}

                  {
                    !isDeleted && isEdited &&
                    <span
                      style={{
                        userSelect: "none",
                        color: "#aaaabf",
                        fontSize: "10px"
                      }}
                    >
                      (edited)
                    </span>
                  }
                </span>
              : <img className="content" src={content} />
            }


          </div>
        </>
        : <>
            {
              type === "text" ?
                <span
                  className="content"
                  style={{marginLeft: "68px"}}
                >
                  {content}

                  {!isDeleted && isEdited && " "}

                  {
                    !isDeleted && isEdited &&
                    <span
                      style={{
                        userSelect: "none",
                        color: "#aaaabf",
                        fontSize: "10px"
                      }}
                    >
                      (edited)
                    </span>
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
        isHovered &&
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
            onClick={() => {
              setIsFeaturesVisible(false);
              setIsHovered(false);
            }}
          >
          </div>
          
          <MessageFeatures
            isOwn={isOwn}
          />
        </>
      }

    </div>
  )
}