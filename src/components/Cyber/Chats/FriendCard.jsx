
export function FriendCard({ friendName, friendTitle, currentChat, onFriendCardClick }) {
  return (
    <div className={currentChat === friendName ? "friend-card selected" : "friend-card"} onClick={() => onFriendCardClick(friendName, friendTitle)}>
      <div className="friend-pfp-container">
        <img className="friend-pfp" src="/empty-pfp.webp" />
      </div>
      <div className="friend-info">
        <span className="friend-name">{friendName}</span>
        <span className="friend-title">{friendTitle}</span>
      </div>
    </div>
  )
}