
export function AuthGreeting({ signType }) {
  return (
    <div id="greeting-container">
      <span id="greeting">
        <b>WELCOME TO CYBER CHAT</b> - PLEASE ENTER YOUR EMAIL AND PASSWORD TO 
        {signType === "in" ? ' LOG IN.' 
        : signType === "up" ? " CREATE A NEW ACCOUNT." 
        : ""}
      </span>      
    </div>
  )
}