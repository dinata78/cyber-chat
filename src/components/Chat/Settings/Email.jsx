import { auth } from "../../../../firebase";

export function Email() {
  return (
    <>
      <label>EMAIL</label>

      <div className="segment">
        <span>{auth.currentUser?.email || "Loading..."}</span>
      </div>

      <span className="info">
        You can use your email to receive a password reset link.
      </span>
    </>
  )
}