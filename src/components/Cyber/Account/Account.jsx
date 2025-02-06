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

export function Account({ ownData }) {
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
    <div id="cyber-account">

    </div>
  )
}