import { useRef, useState } from "react";
import { EditSVG } from "../../../svg/EditSVG";
import { CheckSVG } from "../../../svg/CheckSVG";
import { normalizeSpaces, setCursorPosition } from "../../../../utils";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../firebase";
import { AccountEditableSpan } from "./AccountEditableSpan";

export function AccountDisplayName({ displayName, ownData }) { 
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
    const filteredNewDisplayName = normalizeSpaces(newDisplayName);

    if (filteredNewDisplayName === displayName) {
      setIsEditMode(false);
      return;
    }

    if (!filteredNewDisplayName.length) {
      setErrorInfo("Display name can't be empty.");
      return;
    }
    
    const ownDocRef = doc(db, "users", ownData.uid);

    await updateDoc(ownDocRef, {
      ...ownData,
      displayName: filteredNewDisplayName,
    });

    setEditedDisplayName(filteredNewDisplayName);
    setIsEditMode(false);
  }

  const editDisplayName = async () => {
    if (errorInfo.length) setErrorInfo("");

    if (!isEditMode) {
      setIsEditMode(true);
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
      />

      {
        isEditMode &&
        <span className="char-tracker">
          {editedDisplayName.length} / 20
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