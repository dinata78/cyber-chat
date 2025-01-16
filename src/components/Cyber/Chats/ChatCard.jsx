
export function ChatCard({ currentChatName, friendName, friendTitle, friendUid, onChatCardClick }) {
  return (
    <div className={currentChatName === friendName ? "chat-card selected" : "chat-card"} onClick={() => onChatCardClick(friendName, friendTitle, friendUid)}>
      <div className="chat-card-pfp">
        <img src="/empty-pfp.webp" />
      </div>
      <div className="chat-card-info">
        <span className="chat-card-name">{friendName}</span>
        <span className="chat-card-title">{friendTitle}</span>
      </div>
    </div>
  )
}