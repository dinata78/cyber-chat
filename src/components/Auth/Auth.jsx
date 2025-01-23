import { useEffect, useState } from "react"
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

  const navigate = useNavigate();

  const {
    signInData,
    signUpData,
    setSignInData,
    setSignUpData,
    createAccount,
    logIn
  } = useAuth(setIsLoading);

  const onConfirm = (e) => {
    e.preventDefault();
    
    if (signType === "in") {
      logIn();
    }
    else if (signType === "up") {
      createAccount();
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

  return (
    <div id="auth-page">
      <LoadingOverlay isLoading={isLoading} />
      <div id="auth-container">
        <h1 id="main-heading">CYBER CHAT</h1>
        
        <form id="sign-form">

          <div id="sign-type">
            <button 
              type="button"
              id="sign-in"
              className={signType === "in" ? "selected" : null}
              onClick={() => setSignType("in")}
            >
              Sign In
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
            emailValue={
              signType === "in" ? signInData.email
              : signUpData.email 
            } 
            passwordValue={
              signType === "in" ? signInData.password
              : signUpData.password 
            } 
            onEmailChange={
              signType === "in" ? (e) => setSignInData({...signInData, email: e.target.value})
              : (e) => setSignUpData({...signUpData, email: e.target.value})
            }
            onPasswordChange={
              signType === "in" ? (e) => setSignInData({...signInData, password: e.target.value})
              : (e) => setSignUpData({...signUpData, password: e.target.value})
            } 
          />
          
          <div id="auth-button">
            <button
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