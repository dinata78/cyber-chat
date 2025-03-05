import { cancelRequest, handleRequest } from "./handleRequest";
import { useName } from "../../../custom-hooks/useName";
import { groupNames, processDate } from "../../../utils";

export function PendingCard({ ownUid, type, uid, timeCreated }) {
  const { displayName, username } = useName(uid);  

  if (!displayName || !username) return null;

  return (
    <div className="pending-card">
      {
        type === "received" ?
          <>
            <span>
              [ {processDate(timeCreated.toDate())} ] {groupNames(displayName, username)} sent you a friend request!
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
              [ {processDate(timeCreated.toDate())} ] You sent {groupNames(displayName, username)} a friend request!
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