import { deleteUser, sendPasswordResetEmail, signOut } from "firebase/auth";
import { auth, realtimeDb } from "../../../../firebase";
import { useNavigate } from "react-router-dom";
import { ref, update } from "firebase/database";
import { CloseSVG } from "../../svg/CloseSVG";
import { EmailSVG } from "../../svg/EmailSVG"
import { AccountDataCard } from "./AccountDataCard";

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

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, ownData.email);
      alert("Password reset link sent.");
    }
    catch (error) {
      console.error(error);
      alert("Password reset link not sent.")
    }
  }

  const deleteAccount = async () => {
    try {
      await deleteUser(auth.currentUser);
      alert("Account deleted.");
    }
    catch (error) {
      console.error(error);
      alert("Failed to delete the account.")
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
        
        <div id="cyber-account-bottom">
          <div id="account-data">
            <div className="left">
              <img src="/empty-pfp.webp" />
              <AccountDataCard
                label="USERNAME"
                content={ownData.username}
                ownUid={ownData.uid}
              />
              <AccountDataCard
                label="STATUS"
                content="Online"
                ownUid={ownData.uid}
              />
            </div>

            <div className="right">
              <AccountDataCard
                label="DISPLAY NAME"
                content={ownData.name}
                ownUid={ownData.uid}
              />
              <AccountDataCard
                label="TITLE"
                content={ownData.title}
                ownUid={ownData.uid}
              />
              <AccountDataCard
                label="BIO"
                content={ownData.bio}
                ownUid={ownData.uid}
              />
            </div>
          </div>
          <div id="account-email">
            <EmailSVG />
            <span id="email">{ownData.email}</span>
          </div>
          <div id="account-buttons">
            <button
              onClick={logOut}
            >
              Log Out
            </button>
            <button
              onClick={resetPassword}
            >
              Reset Password
            </button>
            <button
              onClick={deleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>
        
      </div>
    </div>
  )
}