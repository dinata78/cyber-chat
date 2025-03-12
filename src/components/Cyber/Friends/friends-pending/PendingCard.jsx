import { cancelRequest, handleRequest } from "../handleRequest";
import { fetchDataFromUid, groupNames, processDate } from "../../../../utils";
import { useEffect, useState } from "react";

export function PendingCard({ ownUid, type, uid, timeCreated, isUnread }) {
  const [displayName, setDisplayName] = useState("...");
  const [username, setUsername] = useState("...");

  useEffect(() => {
    const fetchAndSetNames = async () => {
      const data = await fetchDataFromUid(uid);
      setDisplayName(data.displayName);
      setUsername(data.username);
    }

    fetchAndSetNames();
  }, []);

  return (
    <div className={isUnread ? "pending-card unread" : "pending-card"}>
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