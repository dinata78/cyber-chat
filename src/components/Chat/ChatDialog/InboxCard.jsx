import { deleteDoc, doc } from "firebase/firestore";
import { processDateWithSeconds } from "../../../utils";
import { db } from "../../../../firebase";

export function InboxCard({ ownUid, id, type, name, timeCreated }) {
  
  const dismissInbox = async () => {
    const inboxRef = doc(db, "users", ownUid, "inbox", id);
    await deleteDoc(inboxRef);
  }

  return (
    <div className="inbox-card">
      <span className="time">
        {processDateWithSeconds(timeCreated.toDate())}
        {" "}
      </span>
      {
        type === "new-friend" ?
          <>
            <span className="name">
              {name}
            </span>
            {" is now your friend. "}
          </>
        : <>
            <span className="name">
              {name}
            </span>
            {" rejected your friend request. "}
          </>
      }
      <button onClick={dismissInbox}>
        Dismiss
      </button>
    </div>
  )
}