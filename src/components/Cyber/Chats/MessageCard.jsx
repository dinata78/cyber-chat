import { processDate } from "../../../utils";

export function MessageCard({ senderName, content, timeCreated, isOwnMessage }) {
  return (
    <div className={isOwnMessage ? "message-card own" : "message-card"}>

      <div className={isOwnMessage ? "message-info own" : "message-info"}>

        <div className={isOwnMessage ? "sender-name own" : "sender-name"}>
          {senderName}
        </div>

        <div className="content">
          {content}
        </div>

        <div className="time">
          {processDate(timeCreated.toDate())}
        </div>

      </div>
      
    </div>
  )
}