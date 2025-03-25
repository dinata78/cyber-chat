import { useEffect, useState } from "react";
import { EditSVG } from "../../../svg/EditSVG";
import { CheckSVG } from "../../../svg/CheckSVG";
import { addDoc, collection, deleteDoc, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../../../../../firebase";

export function AccountStatus({ content, ownUid }) { 
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ editedContent, setEditedContent ] = useState(content);
  
  const editOnClick = async () => {
    
    if (!isEditMode) {
      setIsEditMode(true);
    }
    else {
      
      if (content === "Online" && editedContent === "Hidden") {
        const hiddenUsersRef = collection(db, "users", "metadata", "hiddenUsers");

        await addDoc(hiddenUsersRef, {
          uid: ownUid,
        });
      }
      else if (content === "Hidden" && editedContent === "Online") {
        const ownHiddenUserQuery = query(
          collection(db, "users", "metadata", "hiddenUsers"),
          where("uid", "==", ownUid),
          limit(1)
        );

        const ownHiddenUserDocs = await getDocs(ownHiddenUserQuery);
        await deleteDoc(ownHiddenUserDocs.docs[0].ref);
      }

      setIsEditMode(false);
    }

  }

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  return (
    <div className="account-data-card">

      <button onClick={editOnClick}>
        STATUS
        <div className="button-svg">
          {!isEditMode ? <EditSVG /> : <CheckSVG />}
        </div>
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
            <option value="Online">Online</option>
            <option value="Hidden">Hidden</option>
          </select>
      }
      
    </div>
  )
}