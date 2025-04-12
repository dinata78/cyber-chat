import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "../../../../utils";
import { onDisconnect, ref, update } from "firebase/database";
import { realtimeDb } from "../../../../../firebase";
import { CheckSVG, EditSVG } from "../../../svg";

export function AccountStatus({ status, ownUid }) { 
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ editedStatus, setEditedStatus ] = useState(status);

  const editStatus = async () => {
    if (!isEditMode) {
      setIsEditMode(true);
    }
    else {
      const ownStatusRef = ref(realtimeDb, `users/${ownUid}`);

      if (status === "online" && editedStatus === "hidden") {
        onDisconnect(ownStatusRef).cancel();
        await update(ownStatusRef, { status: "hidden" });
      }
      else if (status === "hidden" && editedStatus === "online") {
        onDisconnect(ownStatusRef).update({ status: "offline" });
        await update(ownStatusRef, { status: "online" });
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
            {capitalizeFirstLetter(status) || "(Not Set)"}
          </span>
        : <select
            defaultValue={status}
            onChange={
              (e) => setEditedStatus(e.target.value)
            }
          >
            <option value="online">Online</option>
            <option value="hidden">Hidden</option>
          </select>
      }
      
    </div>
  )
}