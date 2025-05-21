import { useEffect, useRef, useState } from "react"
import { AuthGreeting } from "./AuthGreeting";
import { AuthInput } from "./AuthInput";
import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "../LoadingOverlay";
import { useAuth } from "../../custom-hooks/useAuth"
import { useIsAuth } from "../../custom-hooks/useIsAuth";

export function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [signType, setSignType] = useState("in");
  const [errorInfo, setErrorInfo] = useState("");

  const { isAuth } = useIsAuth();

  const confirmButton = useRef(null);

  const navigate = useNavigate();

  const {
    signInData,
    signUpData,
    setSignInData,
    setSignUpData,
    createAccount,
    logIn
  } = useAuth(setIsLoading);

  const onConfirm = async (e) => {
    e.preventDefault();
    
    if (signType === "in") {
      if (!signInData.email.length || !signInData.password.length) return;

      if (!signInData.email.includes("@")) {
        setErrorInfo("Email is invalid. Please enter a valid email.");
        return;
      }

      if (signInData.password.length < 6 || signInData.password.length > 24) {
        setErrorInfo("Password length should be between 6 to 24 characters.");
        return;
      }

      try {
        await logIn();
      }
      catch (error) {
        const errorCode = error.message;

        if (errorCode === "auth/invalid-credential") {
          setErrorInfo("Invalid email or password. Make sure you entered the correct email and password.");
        }
        else if (errorCode === "auth/wrong-password") {
          setErrorInfo("Wrong password. Make sure you entered the correct password or try resetting your password instead.")
        }
        else if (errorCode === "auth/too-many-requests") {
          setErrorInfo("Too many requests. Please try again later.");
        }
        else {
          setErrorInfo("Error occured while trying to log you in. Make sure you entered the correct credentials or try again later.");
        }
      }
    }
    else if (signType === "up") {
      if (!signUpData.email.length || !signUpData.password.length) return;

      if (signUpData.password.length < 6 || signUpData.password.length > 24) {
        setErrorInfo("Password length should be between 6 to 24 characters.");
        return;
      }
      
      try {
        await createAccount();
      }
      catch (error) {
        const errorCode = error.message;
        
        if (errorCode === "auth/email-already-in-use") {
          setErrorInfo("Email is already in use. Please try again with another email or try logging in instead.");
        }
        else {
          setErrorInfo("Error occured while signing up. Please try again later.");
        }
      }
    }
  }

  useEffect(() => {
    if (isAuth) {
      navigate("/chat");
    }
  }, [isAuth]);

  useEffect(() => {
    if (errorInfo) setErrorInfo("");
  }, [signType])

  return (
    <div id="auth-page">
      <LoadingOverlay isLoading={isLoading} />
      <div id="auth-container">
        <h1 id="main-heading">CYBER CHAT</h1>
        
        <form id="sign-form" onSubmit={(e) => e.preventDefault()}>

          <div id="sign-type">
            <button 
              type="button"
              id="sign-in"
              className={signType === "in" ? "selected" : null}
              onClick={() => setSignType("in")}
            >
              Log In
            </button>                  
            <button
              type="button"
              id="sign-up"
              className={signType === "up" ? "selected" : null}
              onClick={() => setSignType("up")}
            >
              Sign Up
            </button>
          </div>

          <AuthGreeting signType={signType}/>

          <AuthInput
            signType={signType}
            emailValue={
              signType === "in" ? signInData.email
              : signUpData.email 
            } 
            passwordValue={
              signType === "in" ? signInData.password
              : signUpData.password
            } 
            onEmailChange={
              signType === "in" ? 
                (e) => setSignInData({...signInData, email: e.target.value})
              : (e) => setSignUpData({...signUpData, email: e.target.value})
            }
            onPasswordChange={
              signType === "in" ?
                (e) => setSignInData({...signInData, password: e.target.value})
              : (e) => setSignUpData({...signUpData, password: e.target.value})
            }
            confirm={() => confirmButton.current.click()}
            errorInfo={errorInfo}
            clearErrorInfo={() => setErrorInfo("")}
          />
          
          <div id="auth-button">
            <button
              ref={confirmButton}
              type="submit"
              className="confirm"
              onClick={onConfirm}
            >
              CONFIRM
            </button>

            {
              signType === "in" &&
              <button 
                className="reset-password"
                onClick={() => navigate("/reset-password")}
              >
                Forgot password?
              </button>
            }
          </div>

        </form>

      </div>      
    </div>
  )
}