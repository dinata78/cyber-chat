
export function FriendCard({ currentChat, friendName, friendTitle, friendUid, onFriendCardClick }) {
  return (
    <div className={currentChat === friendName ? "friend-card selected" : "friend-card"} onClick={() => onFriendCardClick(friendName, friendTitle, friendUid)}>
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