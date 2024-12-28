import { useState } from "react"
import { AuthGreeting } from "./AuthGreeting";
import { AuthInput } from "./AuthInput";

export function Auth() {
  const [signType, setSignType] = useState("in");
  const [signInData, setSignInData] = useState({email: "", password: ""});
  const [signUpData, setSignUpData] = useState({email: "", password: ""});

  const onSubmit = () => {
    
  }

  return (
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
        
        <div id="button-container">
          <button>CONFIRM</button>
        </div>
      </form>
    </div>
  )
}