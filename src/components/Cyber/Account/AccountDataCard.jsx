
export function AccountDataCard({ label, content }) {
  
  return (
    <div className="account-data-card">
      <span className="label">{label}</span>
      <span className="content">{content}</span>
    </div>
  )
}