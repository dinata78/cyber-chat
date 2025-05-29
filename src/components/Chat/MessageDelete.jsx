import { doc, updateDoc } from "firebase/firestore";
import { CloseSVG } from "../svg";
import { db } from "../../../firebase";
import { deleteImageFromDb } from "../../utils";
import { notify } from "../Notification";

export function MessageDelete({ closeModal, conversationId, messageId, senderPfpUrl, senderDisplayName, timeCreated, contentType, content }) {

  const deleteMessage = async () => {
    closeModal();

    const currentMessageRef = doc(db, "conversations", conversationId, "messages", messageId);

    try {
      if (contentType === "image") {
        const success = await deleteImageFromDb(content);

        if (!success) {
          console.error("Error: Failed to delete image.");
          notify(null, "Failed to delete image.");
          return;
        }
      }

      await updateDoc(currentMessageRef, {
        isDeleted: true,
        type: "text",
        content: null,
      });

      notify(null, "Message deleted successfully.");      
    }
    catch (error) {
      console.error(error);

      notify(null, "Failed to delete message.");
    }
  }

  return (
    <div id="message-delete" onClick={closeModal}>
      <div className="container" onClick={(e) => e.stopPropagation()}>

        <h1>Delete Message</h1>

        <span>
          Are you sure you want to delete this message?
        </span>

        <div className="message">
          <img className="pfp" src={senderPfpUrl || "/empty-pfp.webp"} />
          <div className="right">
            <div className="top">
              <span className="text-overflow-support" style={{fontSize: "15px"}}>
                {senderDisplayName}
              </span>
              <span
                style={{
                  userSelect: "none",
                  whiteSpace: "nowrap",
                  color: "#9999ab",
                  fontSize: "10px"
                }}>
                {timeCreated}
              </span>
            </div>
            {
              contentType === "text" &&              
              <span className="content">
                {content}
              </span>
            }
            {
              contentType === "image" &&
              <img className="content" src={content} />
            }
          </div>
        </div>

        <div className="buttons">
          <button onClick={closeModal}>
            Cancel
          </button>
          <button style={{backgroundColor: "#b00"}} onClick={deleteMessage}>
            Delete
          </button>
        </div>

      </div>
    </div>
  )
}