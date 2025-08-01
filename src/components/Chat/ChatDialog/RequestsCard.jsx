import { useUserData } from "../../../custom-hooks/useUserData"
import { acceptFriendRequest, cancelFriendRequest, processDate, rejectFriendRequest } from "../../../utils";
import { previewAccount } from "../../AccountPreview";

export function RequestsCard({ type, id, from, to, timeCreated }) {
  const [ userData ] = useUserData(type === "sent" ? to : from);

  if (!userData.displayName) return;

  const handlePreviewAccount = () => {
    previewAccount({
      uid: userData.uid,
      pfpUrl: userData.pfpUrl,
      displayName: userData.displayName,
      username: userData.username,
      bio: userData.bio
    });
  }

  return (
    <div className="requests-card">
      <span className="time">
        {processDate(timeCreated.toDate())}
        {" "}
      </span>
      {
        type === "sent" ?
          <>
             {"You sent "}
            <span
              tabIndex={0}
              className="display-name"
              onClick={handlePreviewAccount}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  handlePreviewAccount();
                }
              }}
            >
              {userData.displayName}
            </span>
            {" a friend request."}
          </>
        : <>
            <span
              tabIndex={0}
              className="display-name"
              onClick={handlePreviewAccount}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  handlePreviewAccount();
                }
              }}
            >
              {userData.displayName}
            </span>
            {" sent you a friend request."}
          </>
      }
      {
        type === "sent" ?
          <button
            onClick={() => cancelFriendRequest(id)}
          >
            Cancel
          </button>
        : <div style={{display: "inline-block"}}>
            <button
              style={{
                backgroundColor: "#242",
                color: "#0f0"
              }}
              onClick={() => acceptFriendRequest(id)}
            >
              Accept
            </button>
            <button
              onClick={() => rejectFriendRequest(id)}
            >
              Reject
            </button>
          </div>
      }
    </div>
  )
}