import { EyeSVG } from "../svg/EyeSVG";

export function AuthInput({ signType, isPasswordVisible, setIsPasswordVisible, emailValue, passwordValue, onEmailChange, onPasswordChange, confirm }) {
  return (
    <div id="auth-input">

      <div id="email">
        <label htmlFor="email-input">EMAIL:</label>
        <input
          type="email"
          id="email-input"
          autoComplete="username"
          value={emailValue}
          onChange={onEmailChange} 
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          required
        />
      </div>

      <div id="password" style={{position: "relative"}}>
        <label htmlFor="password-input">PASSWORD:</label>
        <input
          type={!isPasswordVisible ? "password" : "text"}
          id="password-input"
          autoComplete={signType === "in" ? "current-password" : "new-password"}
          value={passwordValue}
          onChange={onPasswordChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              confirm();
            }
          }}
          required
        />
        <button className="show-password" onClick={() => setIsPasswordVisible(prev => !prev)}>
          <EyeSVG />
        </button>
      </div>
      
    </div>
  )
}