import { Link } from "react-router-dom";

export function Home() {
  return (
    <div id="cyber-home-container">
      <h1>Welcome to Cyber Chat</h1>
      <div id="cyber-home-links">
        <Link to="/cyber/chats">Chats</Link>
        <Link to="/cyber/settings">Settings</Link>
        <Link to="/cyber/account">Account</Link>
      </div>
    </div>
  )
}