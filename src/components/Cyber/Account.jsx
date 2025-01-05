import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";

export function Account() {
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      await signOut(auth);
      navigate("/");  
    }
    catch (error) {
      console.error("Log Out Failed: " + error);
    }
  }
  
  return (
    <div>
      <span>This is Account.</span>
      <button onClick={logOut}>Log Out</button>
    </div>
  )
}