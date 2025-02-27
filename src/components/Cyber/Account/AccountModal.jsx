import { capitalizeFirstLetter } from "../../../utils";
import { AccountConfirmDelete } from "./AccountConfirmDelete";

export function AccountModal({ type, executeButton, closeModal }) {
  const getCaption = (type) => {
    if (type === "log-out") return "Log Out";

    else if (
      [
        "reset-password", 
        "reset-password-sent", 
        "reset-password-failed",
        "reset-password-not-allowed"
      ].includes(type)
    ) return "Reset Password";

    else if (
      [
        "delete-account",
        "delete-account-confirmation"
      ].includes(type)
    ) { 
      return "Delete Account";
    }

    else if (
      [
        "verify-email",
        "verify-email-sent",
        "verify-email-failed"
      ].includes(type)
    ) {
      return "Verify Email";
    }
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
      return "Password reset link sent. Please check your email.";
    }
    else if (type === "reset-password-failed") {
      return "Password reset link not sent. Please try again later.";
    }
    else if (type === "reset-password-not-allowed") {
      return "Please verify your email before attempting to reset your password.";
    }
    else if (type === "delete-account-confirmation") {
      return "Deleting your account will remove all of your data on Cyber Chat."
    }
    else if (type === "verify-email") {
      return "An email verification link will be sent to your email."
    }
    else if (type === "verify-email-sent") {
      return "Email verification link sent. Please check your email.";
    }
    else if (type === "verify-email-failed") {
      return "Email verification link not sent. Please try again later.";
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
            ![
              "reset-password-sent",
              "reset-password-failed",
              "reset-password-not-allowed",
              "delete-account-confirmation",
              "verify-email-sent",
              "verify-email-failed"
            ].includes(type) ?
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
            : type === "delete-account-confirmation" ?
                <AccountConfirmDelete />
            : <div className="buttons">
                <button onClick={closeModal}>Okay</button>
              </div>
          }

        </div>
      </div>
  </div>
  )
}