import { cancelRequest, handleRequest } from "../handleRequest";
import { processDate } from "../../../../utils";

export function PendingCard({ ownUid, type, names, uid, timeCreated, isUnread }) {

  return (
    <div className={isUnread ? "pending-card unread" : "pending-card"}>
      {
        type === "received" ?
          <>
            <span>
              [ {processDate(timeCreated.toDate())} ] *{names?.displayName || "..."} (@{names?.username || "..."})* sent you a friend request!
            </span>
            <div className="pending-card-buttons">
              <button style={{color: "#00ff62"}} onClick={() => handleRequest("accept", ownUid, uid)}>
                ACCEPT
              </button>
              <button style={{color: "red"}} onClick={() => handleRequest("reject", ownUid, uid)}>
                REJECT
              </button>
            </div>
          </>
        :
          <>
            <span>
              [ {processDate(timeCreated.toDate())} ] You sent *{names?.displayName || "..."} (@{names?.username || "..."})* a friend request!
            </span>
            <div className="pending-card-buttons">
              <button style={{color: "red"}} onClick={() => cancelRequest(ownUid, uid)}>
                CANCEL
              </button>
            </div>
          </>
      }
    </div>
  )
}