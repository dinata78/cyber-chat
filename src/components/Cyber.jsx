import { signOut } from "firebase/auth"
import { auth } from "../../firebase"
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoadingContext } from "./App";
import { LoadingOverlay } from "./LoadingOverlay";

export function Cyber() {
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const navigate = useNavigate();

  const logOut = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      navigate("/");  
    }
    catch (error) {
      console.error("Log Out Failed: " + error);
    }
    finally {
      setIsLoading(false);
    }
    
  }

  return (
    <div id="chat-page">
      <LoadingOverlay isLoading={isLoading} />
      <span>Chat Page</span>
      <button onClick={logOut}>Log Out</button>
    </div>
  )
}