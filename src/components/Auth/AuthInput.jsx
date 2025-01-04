
export function AuthInput({ emailValue, passwordValue, onEmailChange, onPasswordChange }) {
  return (
    <div id="auth-input-container">
      <div id="email">
        <label htmlFor="email-input">EMAIL:</label>
        <input type="email" id="email-input" value={emailValue} onChange={onEmailChange} required/>
      </div>
      <div id="password">
        <label htmlFor="password-input">PASSWORD:</label>
        <input type="password" id="password-input" value={passwordValue} onChange={onPasswordChange} required/>
      </div>
    </div>
  )
}