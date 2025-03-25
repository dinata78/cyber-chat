import { useState } from "react";
import { EditSVG } from "../../../svg/EditSVG";
import { CheckSVG } from "../../../svg/CheckSVG";
import { normalizeSpaces } from "../../../../utils";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../firebase";

export function AccountDisplayName({ content, ownData }) { 
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ editedContent, setEditedContent ] = useState(content);
  const [ isContentInvalid, setIsContentInvalid ] = useState(false);
  const [ errorInfo, setErrorInfo ] = useState("");
  const [ isErrorInfoVisible, setIsErrorInfoVisible ] = useState(false);

  const editContent = (e) => {
    if (e.target.value.length <= 20) {
      if (isContentInvalid) setIsContentInvalid(false);
      if (isErrorInfoVisible) setIsErrorInfoVisible(false);

      setEditedContent(e.target.value);
    }
    else {
      setErrorInfo("Character limit reached.")
      setIsContentInvalid(true);
      setIsErrorInfoVisible(true);
    }
  }

  const editOnClick = async () => {

    if (isContentInvalid) setIsContentInvalid(false);
    if (isErrorInfoVisible) setIsErrorInfoVisible(false);

    if (!isEditMode) {
      setIsEditMode(true);
    }
    else {
      const filteredEditedContent = normalizeSpaces(editedContent);

      if (!filteredEditedContent.length) {
        setErrorInfo("Display name can't be empty");
        setIsContentInvalid(true);
        setIsErrorInfoVisible(true);
        return;
      }
      
      if (filteredEditedContent !== content) {
        const ownDocRef = doc(db, "users", ownData.uid);
        await updateDoc(ownDocRef, {
          ...ownData,
          displayName: filteredEditedContent,
        });
      }

      setEditedContent(filteredEditedContent);
      setIsEditMode(false);
    }
    
  }
  
  return (
    <div className="account-data-card">

      <button onClick={editOnClick}>
        DISPLAY NAME
        <div className="button-svg">
          {!isEditMode ? <EditSVG /> : <CheckSVG />}
        </div>
      </button>  

      {
        !isEditMode ?
          <span className="content overflow-y-support">
            {content ? content : "(Not Set)"}
          </span>
        : <input 
            type="text"
            className={isContentInvalid ? "invalid" : ""}
            value={editedContent}
            onChange={editContent}
          />
      }
      
      {
        isEditMode &&
        <span className="char-tracker">
          {editedContent.length} / 20
        </span>
      }

      {
        isErrorInfoVisible &&
        <span className="error-info">
          {errorInfo}
        </span>
      }

    </div>
  )
}