
export function MessageCard({ senderName, content, isOwnMessage }) {
  return (
    <div className={isOwnMessage ? "message-card own-message" : "message-card"}>
      <div className={isOwnMessage ? "message-info own-message" : "message-info"}>
        <div className={isOwnMessage ? "message-sender-name own-message" : "message-sender-name"}>{senderName}</div>
        <div className="message-content">{content}</div>
      </div>
    </div>
  )
}