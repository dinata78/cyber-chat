
export function FriendCard({ currentChat, friendName, friendTitle, friendUid, onFriendCardClick }) {
  return (
    <div className={currentChat === friendName ? "friend-card selected" : "friend-card"} onClick={() => onFriendCardClick(friendName, friendTitle, friendUid)}>
      <div className="friend-card-pfp">
        <img src="/empty-pfp.webp" />
      </div>
      <div className="friend-card-info">
        <span className="friend-card-name">{friendName}</span>
        <span className="friend-card-title">{friendTitle}</span>
      </div>
    </div>
  )
}