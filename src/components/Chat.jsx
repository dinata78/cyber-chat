import { signOut } from "firebase/auth"
import { auth } from "../../firebase"
import { useNavigate } from "react-router-dom";

export function Chat() {
  const navigate = useNavigate();

  const logOut = async () => {
    await signOut(auth);
    navigate("/");
  }

  return (
    <div id="chat-page">
      <span>Chat Page</span>
      <button onClick={logOut}>Log Out</button>
    </div>
  )
}