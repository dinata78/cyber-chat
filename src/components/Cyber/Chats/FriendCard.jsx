
export function FriendCard({ friendName, friendTitle }) {
  return (
    <div className="friend-card">
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