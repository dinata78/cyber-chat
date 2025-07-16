import { useEffect, useState } from "react";
import { auth } from "../../../../firebase";
import { EmailAuthProvider } from "firebase/auth/web-extension";
import { deleteUser, reauthenticateWithCredential } from "firebase/auth";
import { EyeOffSVG, EyeSVG } from "../../svg";
import { deleteOwnConversations, deleteOwnData, deleteOwnStatusFromRtdb } from "../../../utils";
import { addModalToStack, getTopModalFromStack, removeModalFromStack } from "../../modalStack";


export function AccountRemovalModal({ closeModal, inputRef }) {
  const [ password, setPassword ] = useState("");
  const [ isPasswordVisible, setIsPasswordVisible ] = useState(false);
  const [ errorInfo, setErrorInfo ] = useState("");

  const deleteAccount = async () => {
    if (!password.trim()) return;

    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      await deleteOwnConversations();
      await deleteOwnData();
      await deleteOwnStatusFromRtdb();
      await deleteUser(auth.currentUser);
    }
    catch (error) {
      console.error(error)

      if (error.code === "auth/wrong-password") {
        setErrorInfo("The password you entered is incorrect. Please enter the correct password to continue.");
      }
      else if (error.code === "auth/too-many-requests") {
        setErrorInfo("Too many attempts. Please try again later.");
      }
      else {
        setErrorInfo("Internal Server Error. Please try again later.");
      }
    }
  }

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [isPasswordVisible]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (getTopModalFromStack() === "account-removal") {
          closeModal();
          removeModalFromStack("account-removal");
        }
      }
    }

    addModalToStack("account-removal");
    document.addEventListener("keydown", handleEscape);

    return () => {
      removeModalFromStack("account-removal");
      document.removeEventListener("keydown", handleEscape);
    }
  }, []);

  return (
    <div id="account-removal" onClick={closeModal}>
      <div className="container" onClick={(e) => e.stopPropagation()}>
        <h1>Account Removal</h1>

        <span style={{marginBottom: "6px"}}>
          Note: This process cannot be undone. You will not be able to recover your account once you delete it.
        </span>

        <span>
          {
            errorInfo || 
            "Deleting your account will remove all of your data on CyberChat."
          }
        </span>

        <label>
          Please enter your password to continue.
        </label>

        <div className="password-input">
          <input
            ref={inputRef}
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setErrorInfo("");
              setPassword(e.target.value);
            }}
          />
          <button
            className="show-password"
            onClick={() => {
              setIsPasswordVisible(prev => !prev);
            }}
          >
            {isPasswordVisible ? <EyeOffSVG /> : <EyeSVG />}
          </button>
        </div>

        <button
          style={{backgroundColor: "#900"}}
          onClick={deleteAccount}
        >
          Delete Account
        </button>

        <button
          style={{backgroundColor: "#17171c"}}
          onClick={closeModal}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}