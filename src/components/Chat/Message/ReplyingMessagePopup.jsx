import { useEffect } from "react";
import { CloseSVG, ReplySVG } from "../../svg";
import { loadImagesAndScrollTo } from "../../../utils";

export function ReplyingMessagePopup({ messagesRef, focusMessageInput, replyingMessage, replyingMessageSenderName, stopReplying }) {

  useEffect(() => {
    const focusInputAndScrollMessages = async () => {
      focusMessageInput();
      await loadImagesAndScrollTo(messagesRef.current, { top: "max", behavior: "smooth" });
    }

    focusInputAndScrollMessages();
  }, []);

  return (
    <div className="replying-message-popup">

      <ReplySVG />

      <div className="v-line"></div>

      {
        replyingMessage.type === "image" &&
        <img src={replyingMessage.content} />
      }

      <div className="info">
        <span className="text-overflow-support">
          {replyingMessageSenderName}
        </span>
        <span className="text-overflow-support" style={{color: "#d1d5db"}}>
          {
            replyingMessage.type === "text" ? 
              replyingMessage.content
            : "Image"
          }
        </span>
      </div>

      <button
        onClick={() => {
          stopReplying();
          focusMessageInput();
        }}
      >
        <CloseSVG />
      </button>

    </div>
  )
}