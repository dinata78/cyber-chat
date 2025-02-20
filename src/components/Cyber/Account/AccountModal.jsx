import { capitalizeFirstLetter } from "../../../utils";

export function AccountModal({ type, executeButton, closeModal }) {
  const getCaption = (type) => {
    if (type === "log-out") return "Log Out";

    else if (
      [
        "reset-password", 
        "reset-password-sent", 
        "reset-password-failed"
      ].includes(type)
    ) return "Reset Password";

    else return "Delete Account";
  }

  const getDescription = (type) => {
    if (type === "log-out") {
      return "Are you sure you want to log out?";
    }
    else if (type === "reset-password") {
      return "Are you sure you want to reset your password?";
    }
    else if (type === "delete-account") {
      return "Are you sure you want to delete your account?";
    }
    else if (type === "reset-password-sent") {
      return "Password reset link sent. Please check your email."
    }
    else if (type === "reset-password-failed") {
      return "Password reset link not sent. Please try again later."
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
          
          {
            !["reset-password-sent", "reset-password-failed"]
            .includes(type) ?
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
            : <div className="buttons">
                <button onClick={closeModal}>Okay</button>
              </div>
          }

        </div>
      </div>
  </div>
  )
}