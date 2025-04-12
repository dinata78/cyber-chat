import { useRef, useState } from "react";
import { EyeOffSVG, EyeSVG } from "../svg";

export function AuthInput({ signType, emailValue, passwordValue, onEmailChange, onPasswordChange, confirm, errorInfo, clearErrorInfo }) {
  const [ isPasswordVisible, setIsPasswordVisible ] = useState(false); 
  
  const passwordInputRef = useRef(null);

  return (
    <div id="auth-input">

      <div id="email">
        <label htmlFor="email-input">EMAIL:</label>
        <input
          type="text"
          id="email-input"
          autoComplete="username"
          value={emailValue}
          onChange={onEmailChange} 
          onKeyDown={(e) => {
            if (errorInfo) clearErrorInfo();
            if (e.key === "Enter") {
              e.preventDefault();
              passwordInputRef.current.focus();
            }
          }}
        />
      </div>

      <div id="password" style={{position: "relative"}}>
        <label htmlFor="password-input">PASSWORD:</label>
        <input
          ref={passwordInputRef}
          type={!isPasswordVisible ? "password" : "text"}
          id="password-input"
          autoComplete={signType === "in" ? "current-password" : "new-password"}
          value={passwordValue}
          onChange={onPasswordChange}
          onKeyDown={(e) => {
            if (errorInfo) clearErrorInfo();
            if (e.key === "Enter") {
              e.preventDefault();
              confirm();
            }
          }}
        />
        
        <button
          className="show-password"
          onClick={() => {
            setIsPasswordVisible(prev => !prev);
            passwordInputRef.current.focus();
          }}
        >
          {!isPasswordVisible ? <EyeSVG /> : <EyeOffSVG />}
        </button>
        
        {errorInfo && <label className="error-info">{errorInfo}</label>}
          
      </div>
      
    </div>
  )
}