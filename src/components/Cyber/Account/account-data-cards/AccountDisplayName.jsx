import { useRef, useState } from "react";
import { EditSVG } from "../../../svg/EditSVG";
import { CheckSVG } from "../../../svg/CheckSVG";
import { normalizeSpaces, setCursorPosition } from "../../../../utils";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../firebase";
import { AccountEditableSpan } from "./AccountEditableSpan";

export function AccountDisplayName({ displayName, ownUid }) { 
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ editedDisplayName, setEditedDisplayName ] = useState(displayName);
  const [ errorInfo, setErrorInfo ] = useState("");

  const contentRef = useRef(null);

  const inputDisplayName = (e) => {
    const offset = window.getSelection().getRangeAt(0).startOffset;

    if (e.target.innerText.length <= 20) {
      if (errorInfo.length) setErrorInfo("");

      setEditedDisplayName(e.target.innerText);
      contentRef.current.innerText = editedDisplayName;
    }
    else {
      contentRef.current.innerText = editedDisplayName;

      setErrorInfo("Character limit reached.");
    }

    requestAnimationFrame(() => {
      setCursorPosition(contentRef, offset);
    });
  }
  
  const updateDisplayName = async (newDisplayName) => {
    if (errorInfo.length) setErrorInfo("");

    const filteredNewDisplayName = normalizeSpaces(newDisplayName);

    if (filteredNewDisplayName === displayName) {
      setEditedDisplayName(filteredNewDisplayName);
      setIsEditMode(false);
      return;
    }

    if (!filteredNewDisplayName.length) {
      setErrorInfo("Display name can't be empty.");
      return;
    }

    const ownDocRef = doc(db, "users", ownUid);

    await updateDoc(ownDocRef, { displayName: filteredNewDisplayName });

    setEditedDisplayName(filteredNewDisplayName);
    setIsEditMode(false);
  }

  const editDisplayName = async () => {
    if (errorInfo.length) setErrorInfo("");

    if (!isEditMode) {
      setIsEditMode(true);

      requestAnimationFrame(() => {
        setCursorPosition(contentRef, "end");
      });
    }
    else {
      updateDisplayName(editedDisplayName);
    }
  }
  
  return (
    <div className="account-data-card">

      <button onClick={editDisplayName}>
        DISPLAY NAME
        <div className="button-svg">
          {!isEditMode ? <EditSVG /> : <CheckSVG />}
        </div>
      </button>  

      <AccountEditableSpan
        contentRef={contentRef}
        isEditMode={isEditMode}
        errorInfo={errorInfo}
        content={displayName}
        editedContent={editedDisplayName}
        inputContent={inputDisplayName}
        updateContent={updateDisplayName}
      />

      {
        isEditMode &&
        <label className="char-tracker">
          {editedDisplayName.length} / 20
        </label>
      }

      {
        errorInfo.length > 0 &&
        <label className="error-info">
          {errorInfo}
        </label>
      }

    </div>
  )
}