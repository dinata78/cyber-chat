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
      <div id="cyber-account-pfp">
        <div id="account-pfp">
          <img src="/empty-pfp.webp" />
          <div id="account-pfp-edit">
            <EditSVG />
          </div>
        </div>
      </div>
      <hr id="account-pfp-features-border"/>
      <div id="cyber-account-features">
        <div id="account-features-container">
          <div className="account-feature">
            <div className="info-icon">
              <AtSVG />
            </div>
            <div className="account-info">
              <label>Username</label>
              <span>{ownData.username ? ownData.username : "(Not Set)"}</span>
            </div>
            <div className="edit-icon">
              <EditSVG />
            </div>
          </div>
          <hr />
          <div className="account-feature">
            <div className="info-icon">
              <NameSVG />
            </div>
            <div className="account-info">
              <label>Display Name</label>
              <span>{ownData.name}</span>
            </div>
            <div className="edit-icon">
              <EditSVG />
            </div>
          </div>
          <hr />
          <div className="account-feature">
            <div className="info-icon">
              <TitleSVG />
            </div>
            <div className="account-info">
              <label>Title</label>
              <span>{ownData.title}</span>
            </div>
            <div className="edit-icon">
              <EditSVG />
            </div>
          </div>
          <hr />
          <div className="account-feature">
            <div className="info-icon">
              <BioSVG />
            </div>
            <div className="account-info">
              <label>Bio</label>
              <span>{ownData.bio}</span>
            </div>
            <div className="edit-icon">
              <EditSVG />
            </div>
          </div>
          <hr />
          <div className="account-feature">
            <div className="info-icon">
              <EmailSVG />
            </div>
            <div className="account-info">
              <label>Email</label>
              <span>{ownData.email}</span>
            </div>
          </div>
          <hr />
          <div className="account-feature">
            <button>Reset Password</button>
          </div>
          <div className="account-feature">
            <button onClick={logOut}>Log Out</button>
          </div>
          <div className="account-feature">
            <button>Delete Account</button>
          </div>
          <hr />
        </div>
      </div>
    </div>
  )
}