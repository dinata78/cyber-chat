import { useRef, useState } from "react";
import { EditSVG } from "../../../svg/EditSVG";
import { CheckSVG } from "../../../svg/CheckSVG";
import { setCursorPosition } from "../../../../utils";
import { collection, doc, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../../../../firebase";
import { AccountEditableSpan } from "./AccountEditableSpan";

export function AccountUsername({ username, ownUid }) { 
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedUsername, setEditedUsername] = useState(username);
  const [errorInfo, setErrorInfo] = useState("");
  
  const contentRef = useRef(null);

  const inputUsername = (e) => {
    const offset = window.getSelection().getRangeAt(0).startOffset;

    if (e.target.innerText.length <= 15) {
      if (errorInfo.length) setErrorInfo("");

      const filteredEditedUsername = e.target.innerText.replaceAll(" ", "").toLowerCase().trim();

      setEditedUsername(filteredEditedUsername);
      contentRef.current.innerText = editedUsername;
    }
    else {
      contentRef.current.innerText = editedUsername;

      setErrorInfo("Character limit reached.");
    }

    requestAnimationFrame(() => {
      setCursorPosition(contentRef, offset);
    });
  }

  const updateUsername = async (newUsername) => {
    if (errorInfo.length) setErrorInfo("");

    if (newUsername === username) {
      setIsEditMode(false);
      return;
    }

    if (!newUsername.length) {
      setErrorInfo("Username can't be empty.");
      return;
    }

    const newUsernameQuery = query(
      collection(db, "users"),
      where("username", "==", newUsername),
      limit(1)
    )

    const newUsernameDocs = await getDocs(newUsernameQuery);
    
    if (newUsernameDocs.docs.length) {
      setErrorInfo("Username already exists.");
    }
    else {
      const ownDocRef = doc(db, "users", ownUid);
      await updateDoc(ownDocRef, { username: newUsername });

      setIsEditMode(false);
    }
  }

  const editUsername = async () => {
    if (errorInfo.length) setErrorInfo("");

    if (!isEditMode) {
      setIsEditMode(true);

      requestAnimationFrame(() => {
        setCursorPosition(contentRef, "end");
      });
    }
    else {
      updateUsername(editedUsername);
    }
  }

  return (
    <div className="account-data-card">

      <button onClick={editUsername}>
        USERNAME
        <div className="button-svg">
          {!isEditMode ? <EditSVG /> : <CheckSVG />}
        </div>
      </button>

      <AccountEditableSpan
        contentRef={contentRef}
        isEditMode={isEditMode}
        errorInfo={errorInfo}
        content={username}
        editedContent={editedUsername}
        inputContent={inputUsername}
        updateContent={updateUsername}
      />

      {
        isEditMode &&
        <span className="char-tracker">
          {editedUsername?.length || 0} / 15
        </span>
      }

      {
        errorInfo.length > 0 &&
        <span className="error-info">
          {errorInfo}
        </span>
      }

    </div>
  )
}