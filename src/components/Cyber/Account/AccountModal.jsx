
export function AccountModal({ type, func, closeModal }) {
  return (
    <div 
      id="account-modal"
      onClick={closeModal}
    >
      <div
        onClick={(e) => e.stopPropagation()}
      >
        <h1>Log Out</h1>
        <hr />
        <div className="bottom">
          <span>Are you sure you want to log out?</span>
          <div className="buttons">
            <button onClick={closeModal}>Cancel</button>
            <button onClick={func}>Log out</button>
          </div>
        </div>
      </div>
  </div>
  )
}