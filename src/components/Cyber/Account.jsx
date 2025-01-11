import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { EditIconSVG } from "../svg/EditIconSVG";
import { NameIconSVG } from "../svg/NameIconSVG";
import { BioIconSVG } from "../svg/BioIconSVG";
import { EmailIconSVG } from "../svg/EmailIconSVG";
import { doc, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { TitleIconSVG } from "../svg/TitleIconSVG";

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
    <div id="cyber-account-container">
      <div id="cyber-account-pfp">
        <div id="account-pfp-container">
          <img id="account-pfp" src="/empty-pfp.webp" />
          <div id="pfp-edit-icon-container">
            <EditIconSVG className="pfp-edit-icon" />
          </div>
        </div>
      </div>
      <div id="cyber-account-features">
        <div id="account-feature-container">
          <div className="account-feature">
            <div className="account-info-icon">
              <NameIconSVG />
            </div>
            <div className="account-info">
              <label>Name</label>
              <span>{userData.name}</span>
            </div>
            <div className="account-info-edit-icon">
              <EditIconSVG className="info-edit-icon" />
            </div>
          </div>
          <div className="account-feature">
            <div className="account-info-icon">
              <TitleIconSVG />
            </div>
            <div className="account-info">
              <label>Title</label>
              <span>{userData.title}</span>
            </div>
            <div className="account-info-edit-icon">
              <EditIconSVG className="info-edit-icon" />
            </div>
          </div>
          <div className="account-feature">
            <div className="account-info-icon">
              <BioIconSVG />
            </div>
            <div className="account-info">
              <label>Bio</label>
              <span>{userData.bio}</span>
            </div>
            <EditIconSVG className="info-edit-icon" />
          </div>
          <div className="account-feature">
            <div className="account-info-icon">
              <EmailIconSVG />
            </div>
            <div className="account-info">
              <label>Email</label>
              <span>{userData.email}</span>
            </div>
          </div>

          <div className="account-feature">
            <button>Reset Password</button>
          </div>
          <div className="account-feature">
            <button onClick={logOut}>Log Out</button>
          </div>
          <div className="account-feature">
            <button>Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  )
}