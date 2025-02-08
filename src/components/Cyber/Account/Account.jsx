import { signOut } from "firebase/auth";
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
              />
              <AccountDataCard
                label="STATUS"
                content="Online"
              />
            </div>

            <div className="right">
              <AccountDataCard
                label="DISPLAY NAME"
                content={ownData.name}
              />
              <AccountDataCard
                label="TITLE"
                content={ownData.title}
              />
              <AccountDataCard
                label="BIO"
                content={ownData.bio}
              />
            </div>
          </div>
          <div id="account-email">
            <EmailSVG />
            <span id="email">{ownData.email}</span>
          </div>
          <div id="account-buttons">
            <button>
              Log Out
            </button>
            <button>
              Reset Password
            </button>
            <button>
              Delete Account
            </button>
          </div>
        </div>
        
      </div>
    </div>
  )
}