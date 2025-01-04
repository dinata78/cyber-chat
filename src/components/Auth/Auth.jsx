import { useContext, useEffect, useState } from "react"
import { AuthGreeting } from "./AuthGreeting";
import { AuthInput } from "./AuthInput";
import { auth } from "../../../firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "../LoadingOverlay";
import { LoadingContext } from "../App";

export function Auth() {
  const [isAuth, setIsAuth] = useState(null);
  
  const [signType, setSignType] = useState("in");
  const [signInData, setSignInData] = useState({email: "", password: ""});
  const [signUpData, setSignUpData] = useState({email: "", password: ""});

  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const navigate = useNavigate();

  const createAccount = async (email, password) => {
    if (!email.trim() || !password.trim()) return;

    try {
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      setIsAuth(true);  
    }
    catch (error) {
      console.log("Sign Up Failed: " + error);
    }
    finally {
      setIsLoading(false);
    }
  }

  const logIn = async (email, password) => {
    if (!email.trim() || !password.trim()) return;
   
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuth(true);
    }
    catch (error) {
      console.error("Sign In failed: " + error)
    }
    finally {
      setIsLoading(false);
    }
  }

  const onConfirm = (e) => {
    e.preventDefault();
    
    if (signType === "in") {
      logIn(signInData.email, signInData.password);
    }
    else if (signType === "up") {
      createAccount(signUpData.email, signUpData.password);
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
            <button type="button" id="sign-in" className={signType === "in" ? "sign-selected" : ""} onClick={() => setSignType("in")}>Sign In</button>
            <button type="button" id="sign-up" className={signType === "up" ? "sign-selected" : ""} onClick={() => setSignType("up")}>Sign Up</button>
          </div>

          <AuthGreeting signType={signType}/>

          <AuthInput 
            emailValue={signType === "in" ? signInData.email
                        : signType === "up" ? signUpData.email 
                        : ""
            } 
            passwordValue={signType === "in" ? signInData.password
                        : signType === "up" ? signUpData.password 
                        : ""
            } 
            onEmailChange={signType === "in" ? (e) => setSignInData({...signInData, email: e.target.value})
                        : signType === "up" ? (e) => setSignUpData({...signUpData, email: e.target.value})
                        : ""
            }
            onPasswordChange={signType === "in" ? (e) => setSignInData({...signInData, password: e.target.value})
                        : signType === "up" ? (e) => setSignUpData({...signUpData, password: e.target.value})
                        : ""
            } 
          />
          
          <div id="auth-button-container">
            <button type="submit" onClick={onConfirm}>CONFIRM</button>
          </div>
        </form>
      </div>      
    </div>
  )
}