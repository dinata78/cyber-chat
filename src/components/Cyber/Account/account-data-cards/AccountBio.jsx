import { useRef, useState } from "react";
import { EditSVG } from "../../../svg/EditSVG";
import { CheckSVG } from "../../../svg/CheckSVG";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../firebase";
import { normalizeSpaces, setCursorPosition } from "../../../../utils";
import { AccountEditableSpan } from "./AccountEditableSpan";

export function AccountBio({ bio, ownUid }) { 
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ editedBio, setEditedBio ] = useState(bio);
  const [ errorInfo, setErrorInfo ] = useState("");

  const contentRef = useRef(null);

  const inputBio = (e) => {
    const offset = window.getSelection().getRangeAt(0).startOffset;

    if (e.target.innerText.length <= 200) {
      if (errorInfo.length) setErrorInfo("");

      setEditedBio(e.target.innerText);
      contentRef.current.innerText = editedBio;
    }
    else {
      contentRef.current.innerText = editedBio;

      setErrorInfo("Character limit reached.");
    }

    requestAnimationFrame(() => {
      setCursorPosition(contentRef, offset);
    });
  }
  
  const updateBio = async (newBio) => {
    if (errorInfo.length) setErrorInfo("");

    const filteredNewBio = normalizeSpaces(newBio);

    if (filteredNewBio === bio) {
      setIsEditMode(false);
      setEditedBio(filteredNewBio);
      return;
    }
    
    const ownDocRef = doc(db, "users", ownUid);

    await updateDoc(ownDocRef, { bio: filteredNewBio });

    setEditedBio(filteredNewBio);
    setIsEditMode(false);
  }

  const editBio = async () => {
    if (errorInfo.length) setErrorInfo("");

    if (!isEditMode) {
      setIsEditMode(true);

      requestAnimationFrame(() => {
        setCursorPosition(contentRef, "end");
      });
    }
    else {
      updateBio(editedBio);
    }
  }

  return (
    <div className="account-data-card bio">

      <button onClick={editBio}>
        BIO
        <div className="button-svg">
          {!isEditMode ? <EditSVG /> : <CheckSVG />}
        </div>
      </button>  

      <AccountEditableSpan
        contentRef={contentRef}
        isEditMode={isEditMode}
        errorInfo={errorInfo}
        content={bio}
        editedContent={editedBio}
        inputContent={inputBio}
        updateContent={updateBio}
      />
      
      {
        isEditMode &&
        <span className="char-tracker">
          {editedBio.length} / 200
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