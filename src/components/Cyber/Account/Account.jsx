import { signOut } from "firebase/auth";
import { auth, realtimeDb } from "../../../../firebase";
import { useNavigate } from "react-router-dom";
import { AtSVG } from "../../svg/AtSVG";
import { EditSVG } from "../../svg/EditSVG";
import { NameSVG } from "../../svg/NameSVG";
import { BioSVG } from "../../svg/BioSVG";
import { TitleSVG } from "../../svg/TitleSVG";
import { EmailSVG } from "../../svg/EmailSVG";
import { ref, update } from "firebase/database";
import { CloseSVG } from "../../svg/CloseSVG";

export function Account({ ownData, setIsAccountVisible }) {
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      const dbRef = ref(realtimeDb, `users/${auth.currentUser.uid}`);

      await signOut(auth);
      await update(dbRef, { isOnline: false }); 

      navigate("/");  
    }
    catch (error) {
      console.error("Log Out Failed: " + error);
    }
  }
  
  return (
    <div
      id="cyber-account"
      onClick={() => setIsAccountVisible(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
      >
        
        <div id="cyber-account-top">
          <h1>Account</h1>
          <div>
            <button
              onClick={() => setIsAccountVisible(false)}
            >
              <CloseSVG />
            </button>
          </div>
        </div>
        <hr />
        
      </div>
    </div>
  )
}