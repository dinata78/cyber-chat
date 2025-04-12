import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { fetchSignInMethodsForEmail, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase";
import { LoadingOverlay } from "../LoadingOverlay";
import { CheckSVG, LockSVG } from "../svg";

export function ResetPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorInfo, setErrorInfo] = useState("");

  const inputRef = useRef();

  const navigate = useNavigate();

  const sendLink = async () => {
    if (!email.length) return;
    if (!email.includes("@") || email[email.length - 1] === "@") {
      setErrorInfo("Email is invalid. Please make sure you entered the correct email or try again later");
      return;
    }
    
    try {
      setIsLoading(true);

      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (methods.length) {
        try {
          await sendPasswordResetEmail(auth, email);
          setIsSent(true);

        }
        catch {
          setErrorInfo("An error occured. Please try again later.");
          return;
        }
      }
      else {
        setErrorInfo("Email is not registered. Make sure you entered the correct email or try again with another email.");
        return;
      }
    }
    catch (error) {
      const errorCode = error.code;
      if (errorCode === "auth/invalid-email") {
        setErrorInfo("Email is invalid. Please make sure you entered the correct email or try again later.");
      }
      else {
        setErrorInfo("An error occured. Please try again later.");
      }
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [])

  return (
    <div id="reset-password-page">
      <div
        className="container"
        style={{
          padding: isSent ? "0" : null,
          justifyContent: isSent ? "center" : null,
          gap: isSent ? "32px" : null
        }}
      >

        <LoadingOverlay isLoading={isLoading} />

        <div className="icon"
          style={{
            height: isSent ? "30%" : null,
            padding: isSent ? "32px" : null,
            borderColor: isSent ? "lime" : null,
            fill:  isSent ? "lime" : null,
          }}>
          {!isSent ? <LockSVG /> : <CheckSVG />}
        </div>

        <label>
          {!isSent ? "Reset Password" : "Password Reset Link Sent"}
        </label>

        <span>
          {
            !isSent ? 
              "Enter your email and we'll send you a link to reset your password."
            : `We have sent a password reset link to ${email || "your email"}.`
          }
        </span>

        {
          !isSent &&
          <>
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter your email here"
              value={email}
              onKeyDown={(e) => {
                if (errorInfo) setErrorInfo("");
                if (e.key === "Enter") sendLink();
              }}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="send-link" onClick={sendLink}>
              Send Link
            </button>
          </>
        }

        <label className="error-info">{errorInfo}</label>

        <button className="navigate" onClick={() => navigate("/")}>
          Back to login page
        </button>

      </div>
    </div>
  )
}