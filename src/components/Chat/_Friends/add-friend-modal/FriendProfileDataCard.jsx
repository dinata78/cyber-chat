
export function FriendProfileDataCard({ label, content }) {
  return (
    <div className="friend-profile-data-card">
      <span className="label">{label}</span>
      <span className="content overflow-y-support smaller-scrollbar">{content}</span>
    </div>
  )
}