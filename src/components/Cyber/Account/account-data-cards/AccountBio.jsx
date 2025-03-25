import { useState } from "react";
import { EditSVG } from "../../../svg/EditSVG";
import { CheckSVG } from "../../../svg/CheckSVG";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../firebase";
import { normalizeSpaces } from "../../../../utils";

export function AccountBio({ content, ownData }) { 
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ editedContent, setEditedContent ] = useState(content);
  const [ isContentInvalid, setIsContentInvalid ] = useState(false);
  const [ errorInfo, setErrorInfo ] = useState("");
  const [ isErrorInfoVisible, setIsErrorInfoVisible ] = useState(false);

  const editContent = (e) => {
    if (e.target.value.length <= 150) {
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
      
      if (filteredEditedContent !== content) {
        const ownDocRef = doc(db, "users", ownData.uid);
        await updateDoc(ownDocRef, {
          ...ownData,
          bio: filteredEditedContent,
        });
      }

      setEditedContent(filteredEditedContent);
      setIsEditMode(false);
    }

  }

  return (
    <div className="account-data-card bio">

      <button onClick={editOnClick}>
        BIO
        <div className="button-svg">
          {!isEditMode ? <EditSVG /> : <CheckSVG />}
        </div>
      </button>  

      {
        !isEditMode ?
          <span className="content overflow-y-support">
            {content ? content : "(Not Set)"}
          </span>
        : <textarea
            className={isContentInvalid ? "invalid overflow-y-support" : "overflow-y-support"}
            value={editedContent}
            onChange={editContent}
          >
            {content}
          </textarea>
      }
      
      {
        isEditMode &&
        <span className="char-tracker">
          {editedContent.length} / 150
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