import { useEffect, useState } from "react"
import { auth } from "../../firebase";
import { previewImage } from "./ImagePreview";
import { useFriendList } from "../custom-hooks/useFriendList";
import { chatFriend, openSettings } from "./Chat/Chat";
import { addModalToStack, getTopModalFromStack, removeModalFromStack } from "./modalStack";
import { useRequests } from "../custom-hooks/useRequests";
import { sendFriendRequest } from "../utils";
import { useDM } from "../custom-hooks/useDM";

let previewAccountGlobal;

export function previewAccount(data) {
  previewAccountGlobal?.(
    data.uid,
    data.pfpUrl,
    data.displayName,
    data.username,
    data.bio,
  );
}

export function AccountPreview() {
  const [ uid, setUid ] = useState("");
  const [ pfpUrl, setPfpUrl ] = useState("");
  const [ displayName, setDisplayName ] = useState("");
  const [ username, setUsername ] = useState("");
  const [ bio, setBio ] = useState("");

  const ownUid = auth.currentUser?.uid;

  const { DMIds, isDMIdsLoading } = useDM(ownUid);
  const { friendUids } = useFriendList(ownUid);
  const { requests } = useRequests(ownUid);

  const sentRequestsUids = requests.filter(request => request.from === ownUid).map(sentRequest => sentRequest.to);
  const receivedRequestsUids = requests.filter(request => request.to === ownUid).map(receivedRequest => receivedRequest.from);

  const profileType = 
    uid === ownUid ?
      "own"
    : friendUids.includes(uid) || uid == import.meta.env.VITE_DEV_UID  ?
      "friend"
    : sentRequestsUids.includes(uid) ?
      "friend-pending-sent"
    : receivedRequestsUids.includes(uid) ?
      "friend-pending-received"
    : "new"

  const isPending = profileType.startsWith("friend-pending");

  const closeAccountPreview = () => {
    setUid("");
    setPfpUrl("");
    setDisplayName("");
    setUsername("");
    setBio("");
  }

  const handleEditProfile = () => {
    openSettings();
    closeAccountPreview();
  }

  const handleMessageFriend = async () => {
    await chatFriend(ownUid, uid, DMIds, isDMIdsLoading);
    closeAccountPreview();
  }

  useEffect(() => {
    previewAccountGlobal = (uid, pfpUrl, displayName, username, bio) => {
      setUid(uid);
      setPfpUrl(pfpUrl);
      setDisplayName(displayName);
      setUsername(username);
      setBio(bio);
    }
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (getTopModalFromStack() === "account-preview") {
          closeAccountPreview();
          removeModalFromStack();
        }
      }
    }

    if (uid) {
      document.addEventListener("keydown", handleEscape);
      addModalToStack("account-preview");
    }
    else {
      document.addEventListener("keydown", handleEscape);
      removeModalFromStack("account-preview");
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      removeModalFromStack("account-preview");
    }
  }, [uid])

  if (!uid) return null;

  return (
    <div id="account-preview" onClick={closeAccountPreview}>
      <div className="container" onClick={(e) => e.stopPropagation()}>

        <div className="header">
          <img
            src={pfpUrl || "/empty-pfp.webp"}
            onClick={() => previewImage(pfpUrl || "/empty-pfp.webp")}
          />
        </div>

        <main>
          <div className="cell">
            <span
              className="text-overflow-support"
              style={{
                maxWidth: "90%",
                marginTop: "32px"
              }}
            >
              {displayName || "Anonymous"}
            </span>
            <span
              className="text-overflow-support"
              style={{
                maxWidth: "90%",
                color: "#ccd",
                fontSize: "14px"
              }}
            >
              {username && `@${username}`}
            </span>
            <span
              className="text-overflow-support"
              style={{
                maxWidth: "90%",
                marginTop: "auto",
                marginBottom: "8px",
                color: "#ccd",
                fontSize: "12px"
              }}
            >
              ID: {uid || "..."}
            </span>
            <hr />
            <button
              style={{
                cursor: isPending && "auto",
                backgroundColor: isPending && "#80d9",
                color: isPending && "#bbc"
              }}
              onClick={
                profileType === "own" ? handleEditProfile
                : profileType === "friend" ? handleMessageFriend
                : profileType === "new" ? () => sendFriendRequest(uid)
                : null
              }
            >
              {
                profileType === "own" ?
                  "Edit Profile"
                : profileType === "friend" ?
                  "Message Friend"
                : profileType === "friend-pending-sent" ?
                  "Friend Request Sent"
                : profileType === "friend-pending-received" ?
                  "Friend Request Received"
                : "Add Friend"
              }
            </button>
          </div>
          <div className="cell">
            <span
              style={{
                marginTop: "12px",
                fontSize: "12px"
              }}
            >
              ABOUT ME
            </span>
            <span className="about-me overflow-y-support">
              {bio || "-"}
            </span>
          </div>
        </main>

      </div>
    </div>
  )
}