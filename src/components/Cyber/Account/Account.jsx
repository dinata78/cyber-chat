import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../../../firebase";
import { useNavigate } from "react-router-dom";
import { EditIconSVG } from "../../svg/EditIconSVG";
import { NameIconSVG } from "../../svg/NameIconSVG";
import { BioIconSVG } from "../../svg/BioIconSVG";
import { EmailIconSVG } from "../../svg/EmailIconSVG";
import { doc, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { TitleIconSVG } from "../../svg/TitleIconSVG";
import { AtIconSVG } from "../../svg/AtIconSVG";

export function Account() {
  const [userData, setUserData] = useState({});

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

  let unsubscribeSnapshot = null;

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (authUser) {
        const currentUserQuery = query(
          doc(db, "users", authUser.uid)
        )
  
        unsubscribeSnapshot = onSnapshot(
          currentUserQuery, (docSnapshot) => {
            setUserData(docSnapshot.data());
          }
        )
      }

    })

    return () => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }
      unsubscribeAuth();
    }
  }, []);
  
  return (
    <div id="cyber-account">
      <div id="cyber-account-pfp">
        <div id="account-pfp">
          <img src="/empty-pfp.webp" />
          <div id="account-pfp-edit">
            <EditIconSVG />
          </div>
        </div>
      </div>
      <hr id="account-pfp-features-border"/>
      <div id="cyber-account-features">
        <div id="account-features-container">
          <div className="account-feature">
            <div className="info-icon">
              <AtIconSVG />
            </div>
            <div className="account-info">
              <label>Username</label>
              <span>{userData.username ? userData.username : "(Not Set)"}</span>
            </div>
            <div className="edit-icon">
              <EditIconSVG />
            </div>
          </div>
          <hr />
          <div className="account-feature">
            <div className="info-icon">
              <NameIconSVG />
            </div>
            <div className="account-info">
              <label>Display Name</label>
              <span>{userData.name}</span>
            </div>
            <div className="edit-icon">
              <EditIconSVG />
            </div>
          </div>
          <hr />
          <div className="account-feature">
            <div className="info-icon">
              <TitleIconSVG />
            </div>
            <div className="account-info">
              <label>Title</label>
              <span>{userData.title}</span>
            </div>
            <div className="edit-icon">
              <EditIconSVG />
            </div>
          </div>
          <hr />
          <div className="account-feature">
            <div className="info-icon">
              <BioIconSVG />
            </div>
            <div className="account-info">
              <label>Bio</label>
              <span>{userData.bio}</span>
            </div>
            <div className="edit-icon">
              <EditIconSVG />
            </div>
          </div>
          <hr />
          <div className="account-feature">
            <div className="info-icon">
              <EmailIconSVG />
            </div>
            <div className="account-info">
              <label>Email</label>
              <span>{userData.email}</span>
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