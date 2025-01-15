
export function FriendCard({ currentChatName, friendName, friendTitle, friendUid, onFriendCardClick }) {
  return (
    <div className={currentChatName === friendName ? "friend-card selected" : "friend-card"} onClick={() => onFriendCardClick(friendName, friendTitle, friendUid)}>
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