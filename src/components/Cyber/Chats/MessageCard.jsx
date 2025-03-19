import { processDate } from "../../../utils";

export function MessageCard({ senderName, content, timeCreated, isUnread, isOwnMessage, selectedChatUid, prevSelectedChatUid }) {

  return (
    <div className={isOwnMessage ? "message-card own" : "message-card"}>

      <div className={isOwnMessage ? "container own" : "container"}>

        <div className={isOwnMessage ? "sender-name own" : "sender-name"}>
          {senderName}
        </div>

        <div className="content">
          {content}
        </div>

        <div className="time">
          {processDate(timeCreated.toDate())}
        </div>

        {
          !isOwnMessage && isUnread && selectedChatUid !== prevSelectedChatUid.current  &&
          <label className="unread-indicator" title="Unread message">!</label>
        }

      </div>
      
    </div>
  )
}