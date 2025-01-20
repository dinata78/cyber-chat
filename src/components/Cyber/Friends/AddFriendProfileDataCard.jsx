
export function AddFriendProfileDataCard({ label, content }) {
  return (
    <div className="add-friend-profile-data-card">
      <span className="label">{label}</span>
      <span>{content}</span>
    </div>
  )
}