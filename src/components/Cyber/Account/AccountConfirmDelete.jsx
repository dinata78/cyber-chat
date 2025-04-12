import { useState } from "react";
import { deleteAccount } from "./accountFunctions";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "../../../../firebase";
import { useNavigate } from "react-router-dom";
import { EyeOffSVG, EyeSVG } from "../../svg";

export function AccountConfirmDelete() {
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorInfo, setErrorInfo] = useState("This process cannot be undone. You will not be able to recover the account once you delete it."); 

  const navigate = useNavigate();

  const buttonOnClick = async (email, password) => {
    try {
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await deleteAccount();
      navigate("/");
    }
    catch (error) {
      if (error.code === "auth/invalid-credential") {
        setErrorInfo("The password you entered is incorrect. Please enter the correct password to continue.");
      }
      else if (error.code === "auth/too-many-requests") {
        setErrorInfo("Too many attempts. Please try again later.")
      }
      else {
        setErrorInfo("Internal Server Error. Please try again later.")
      }
    }
  }

  return (
    <>
      <div className="confirm-delete">
        <span>Please enter your password to continue.</span>
        <input 
          type={isPasswordVisible ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div
          className="password-visibility"
          onClick={() => setIsPasswordVisible(prev => !prev)}
        >
          {
            isPasswordVisible ?
              <EyeOffSVG />
            : <EyeSVG />
          }
        </div>
        <button
          onClick={() => buttonOnClick(auth.currentUser.email, password)}
        >
          Delete account
        </button>
        <span className="error-info">
          {errorInfo}
        </span>
      </div>            
    </>
  )
}