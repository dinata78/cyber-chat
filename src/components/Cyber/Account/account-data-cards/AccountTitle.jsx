import { useState } from "react";
import { EditSVG } from "../../../svg/EditSVG";
import { CheckSVG } from "../../../svg/CheckSVG";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../firebase";

export function AccountTitle({ title, ownUid }) { 
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ editedTitle, setEditedTitle ] = useState(title);

  const editTitle = async () => {
    if (!isEditMode) {
      setIsEditMode(true);
    }
    else {
      if (editedTitle !== title) {
        const ownDocRef = doc(db, "users", ownUid);
        await updateDoc(ownDocRef, { title: editedTitle });
      }

      setIsEditMode(false);
    }
  }

  return (
    <div className="account-data-card">

      <button onClick={editTitle}>
        TITLE
        <div className="button-svg">
          {!isEditMode ? <EditSVG /> : <CheckSVG />}
        </div>
      </button>  

      {
        !isEditMode ?
          <span className="content overflow-y-support">
            {title || "(Not Set)"}
          </span>
        : <select 
            defaultValue={title}
            onChange={
              (e) => setEditedTitle(e.target.value)
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