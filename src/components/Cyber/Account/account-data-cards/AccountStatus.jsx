import { useEffect, useState } from "react";
import { EditSVG } from "../../../svg/EditSVG";
import { CheckSVG } from "../../../svg/CheckSVG";
import { addDoc, collection, deleteDoc, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../../../../../firebase";

export function AccountStatus({ status, ownUid }) { 
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ editedStatus, setEditedStatus ] = useState(status);

  const editStatus = async () => {
    if (!isEditMode) {
      setIsEditMode(true);
    }
    else {
      if (status === "Online" && editedStatus === "Hidden") {
        const hiddenUsersRef = collection(db, "users", "metadata", "hiddenUsers");

        await addDoc(hiddenUsersRef, { uid: ownUid });
      }
      else if (status === "Hidden" && editedStatus === "Online") {
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
    setEditedStatus(status);
  }, [status]);

  return (
    <div className="account-data-card">

      <button onClick={editStatus}>
        STATUS
        <div className="button-svg">
          {!isEditMode ? <EditSVG /> : <CheckSVG />}
        </div>
      </button>

      {
        !isEditMode ?
          <span className="content overflow-y-support">
            {status || "(Not Set)"}
          </span>
        : <select
            defaultValue={status}
            onChange={
              (e) => setEditedStatus(e.target.value)
            }
          >
            <option value="Online">Online</option>
            <option value="Hidden">Hidden</option>
          </select>
      }
      
    </div>
  )
}