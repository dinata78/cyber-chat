import { useState } from "react";
import { EditSVG } from "../../../svg/EditSVG";
import { CheckSVG } from "../../../svg/CheckSVG";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../firebase";

export function AccountTitle({ content, ownData }) { 
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ editedContent, setEditedContent ] = useState(content);

  const editOnClick = async () => {
  
    if (!isEditMode) {
      setIsEditMode(true);
    }
    else {
      if (editedContent !== content) {
        const ownDocRef = doc(db, "users", ownData.uid);
        await updateDoc(ownDocRef, {
          ...ownData,
          title: editedContent,
        });
      }

      setIsEditMode(false);
    }

  }

  return (
    <div className="account-data-card">

      <button onClick={editOnClick}>
        TITLE
        {!isEditMode ? <EditSVG /> : <CheckSVG />}
      </button>  

      {
        !isEditMode ?
          <span className="content overflow-y-support">
            {content ? content : "(Not Set)"}
          </span>
        : <select 
            defaultValue={content}
            onChange={
              (e) => setEditedContent(e.target.value)
            }
          >
            <option value="Newcomer">Newcomer</option>
            <option value="Edgerunner">Edgerunner</option>
            <option value="Netrunner">Netrunner</option>
          </select>
      }
      
    </div>
  )
}