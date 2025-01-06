import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { EditIconSVG } from "../svg/EditIconSVG";
import { NameIconSVG } from "../svg/NameIconSVG";
import { BioIconSVG } from "../svg/BioIconSVG";
import { EmailIconSVG } from "../svg/EmailIconSVG";

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
              <span>Anonymous</span>
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
              <span>Hello world! How are you guys doing?</span>
            </div>
            <EditIconSVG className="info-edit-icon" />
          </div>
          <div className="account-feature">
            <div className="account-info-icon">
              <EmailIconSVG />
            </div>
            <div className="account-info">
              <label>Email</label>
              <span>myemail@mail.com</span>
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