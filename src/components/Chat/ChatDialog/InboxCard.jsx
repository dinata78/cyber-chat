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
        : type === "friend-removed" ?
          <>
            <span className="name">
              {name}
            </span>
            {" is no longer your friend."}
          </>
        : type === "request-rejected" ? 
          <>
            <span className="name">
              {name}
            </span>
            {" rejected your friend request. "}
          </>
        : null
      }
      <button onClick={dismissInbox}>
        Dismiss
      </button>
    </div>
  )
}