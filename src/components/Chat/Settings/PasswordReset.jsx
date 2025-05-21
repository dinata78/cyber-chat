import { useNavigate } from "react-router-dom"

export function PasswordReset() {4
  const navigate = useNavigate();

  return (
    <>
      <label>PASSWORD RESET</label>

      <div className="segment">
        <span style={{color: "#bbc"}}>
          Receive password reset link in your email.
        </span>
        <button onClick={() => navigate("/reset-password")}>
          Reset
        </button>
      </div>
    </>
  )
}