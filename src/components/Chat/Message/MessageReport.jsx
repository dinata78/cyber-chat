import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../../firebase";
import { notify } from "../../Notification";

export function MessageReport({ closeModal, ownUid, conversationId, reportingData }) {
  const { messageId, pfpUrl, displayName, timeCreated, type, content } = reportingData;

  const reportMessage = async () => {
    closeModal();
    console.log("Reporting: " + messageId);

    const reportsRef = collection(db, "reports");

    try {
      await addDoc(reportsRef, {
        senderUid: ownUid,
        conversationId: conversationId,
        messageId: messageId,
      })

      notify(null, "Message reported successfully.");
    }
    catch (error) {
      console.error(error);
      notify(null, "Failed to report message.");
    }
  }

  return (
    <div id="message-modal" onClick={closeModal}>
      <div className="container" onClick={(e) => e.stopPropagation()}>

        <h1>Report Message</h1>

        <span>
          Are you sure you want to report this message?
        </span>

        <div className="message" style={{border: "1px solid #f009"}}>
          <img className="pfp" src={pfpUrl || "/empty-pfp.webp"} />
          <div className="right">
            <div className="top">
              <span className="text-overflow-support" style={{fontSize: "15px"}}>
                {displayName}
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
              type === "text" &&              
              <span className="content">
                {content}
              </span>
            }
            {
              type === "image" &&
              <img className="content" src={content} />
            }
          </div>
        </div>

        <div className="buttons">
          <button onClick={closeModal}>
            Cancel
          </button>
          <button style={{backgroundColor: "#b00"}} onClick={reportMessage}>
            Report
          </button>
        </div>

      </div>
    </div>
  )
}