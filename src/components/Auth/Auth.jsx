import { useEffect, useRef, useState } from "react"
import { AuthGreeting } from "./AuthGreeting";
import { AuthInput } from "./AuthInput";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "../LoadingOverlay";
import { useAuth } from "../../custom-hooks/useAuth"

export function Auth() {
  const [isAuth, setIsAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [signType, setSignType] = useState("in");
  const [errorInfo, setErrorInfo] = useState("");

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
      try {
        await logIn();
      }
      catch (error) {
        const errorCode = error.message;

        if (errorCode === "auth/invalid-credential") {
          setErrorInfo("Invalid email or password. Make sure you enter the correct email and password.");
        }
        else if (errorCode === "auth/too-many-requests") {
          setErrorInfo("Too many requests. Please try again later.");
        }
        else {
          setErrorInfo("Error occured while trying to log you in. Please try again later.");
        }
      }
    }
    else if (signType === "up") {
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
          setErrorInfo("Error occured while signing up. Please try again later.")
        }
      }
    }
  }

  useEffect(() => {
    if (isAuth) {
      navigate("/cyber");
    }
  }, [isAuth]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      if (auth.currentUser) {
        setIsAuth(true);
      }
      else {
        setIsAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

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
              onClick={onConfirm}
            >
              CONFIRM
            </button>
          </div>

        </form>

      </div>      
    </div>
  )
}