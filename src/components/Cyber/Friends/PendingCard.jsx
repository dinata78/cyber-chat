import { useEffect, useState } from "react"
import { fetchDataFromUid } from "../../../utils";

export function PendingCard({ type, uid }) {
  const [name, setName] = useState("...");
  const [username, setUsername] = useState("...");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDataFromUid(uid);
      setName(data.name);
      setUsername(data.username);
    }
    fetchData();
  }, []);

  return (
    <div className="pending-card">
      {
        type === "received" ?
          <>
            <span>
              <b style={{color:"#aaddff"}}>{name} (@{username})</b> sent you a friend request!
            </span>
            <div className="pending-card-buttons">
              <button
                style={{color: "#00ff62"}}
              >
                ACCEPT
              </button>
              <button
                style={{color: "red"}}
              >
                REJECT
              </button>
            </div>
          </>
        :
          <>
            <span>
              You sent <b style={{color: "#aaddff"}}>{name} (@{username})</b> a friend request!
            </span>
            <div className="pending-card-buttons">
              <button
                style={{color: "red"}}
              >
                CANCEL
              </button>
            </div>
          </>
      }
    </div>
  )
}