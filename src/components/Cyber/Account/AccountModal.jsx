import { capitalizeFirstLetter } from "../../../utils";

export function AccountModal({ type, executeButton, closeModal }) {
  const getCaption = (type) => {
    if (type === "log-out") return "Log Out";
    else if (type === "reset-password") return "Reset Password";
    else return "Delete Account";
  }

  const getDescription = (type) => {
    if (type === "log-out") {
      return "Are you sure you want to log out?";
    }
    else if (type === "reset-password") {
      return "Are you sure you want to reset your password?";
    }
    else {
      return "Are you sure you want to delete your account?";
    }
  }
  
  return (
    <div 
      id="account-modal"
      onClick={closeModal}
    >
      <div
        onClick={(e) => e.stopPropagation()}
      > 
        <h1>
          {getCaption(type)}
        </h1>
        <hr />
        <div className="bottom">
          <span>
            {getDescription(type)}
          </span>
          <div className="buttons">
            <button onClick={closeModal}>Cancel</button>
            <button onClick={() => executeButton(type)}>
              {
                capitalizeFirstLetter(
                  getCaption(type)
                  .toLowerCase()
                )
              }
            </button>
          </div>
        </div>
      </div>
  </div>
  )
}