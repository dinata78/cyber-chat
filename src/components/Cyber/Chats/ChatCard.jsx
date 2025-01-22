
export function ChatCard({ currentChatName, name, title, uid, onChatCardClick }) {
  return (
    <div 
      className={
        currentChatName === name ? "chat-card selected" 
        : "chat-card"
      } 
      onClick={
        () => onChatCardClick(name, title, uid)
      }
    >

      <div className="chat-card-pfp">
        <img src="/empty-pfp.webp" />
      </div>

      <div className="chat-card-info">
        <span className="chat-card-name">{name}</span>
        <span className="chat-card-title">{title}</span>
      </div>

    </div>
  )
}