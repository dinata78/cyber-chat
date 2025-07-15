import { useEffect, useState } from "react"
import { auth } from "../../firebase";
import { previewImage } from "./ImagePreview";
import { useFriendList } from "../custom-hooks/useFriendList";
import { chatFriend, openSettings } from "./Chat/Chat";

let previewAccountGlobal;

export function previewAccount(data) {
  previewAccountGlobal?.(
    data.uid,
    data.pfpUrl,
    data.displayName,
    data.username,
    data.bio,
    data.DMIds,
    data.isDMIdsLoading
  );
}

export function AccountPreview() {
  const [ uid, setUid ] = useState("");
  const [ pfpUrl, setPfpUrl ]= useState("");
  const [ displayName, setDisplayName ] = useState("");
  const [ username, setUsername ] = useState("");
  const [ bio, setBio ] = useState("");
  const [ DMIds, setDMIds ] = useState(undefined);
  const [ isDMIdsLoading, setIsDMIdsLoading ] = useState(undefined);

  useEffect(() => {
    console.log(DMIds)
    console.log(isDMIdsLoading)
  }, [DMIds, isDMIdsLoading])

  const ownUid = auth.currentUser?.uid;

  const { friendUids } = useFriendList(ownUid);

  const profileType = 
    uid === ownUid ? "own"
    : friendUids.includes(uid) ? "friend"
    : "new"

  const closeAccountPreview = () => {
    setUid("");
    setPfpUrl("");
    setDisplayName("");
    setUsername("");
    setBio("");
    setDMIds(undefined);
    setIsDMIdsLoading(undefined);
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
    previewAccountGlobal = (uid, pfpUrl, displayName, username, bio, DMIds, isDMIdsLoading) => {
      setUid(uid);
      setPfpUrl(pfpUrl);
      setDisplayName(displayName);
      setUsername(username);
      setBio(bio);
      setDMIds(DMIds);
      setIsDMIdsLoading(isDMIdsLoading);
    }
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeAccountPreview();
      }
    }

    if (uid) {
      document.addEventListener("keydown", handleEscape);
    }
    else {
      document.addEventListener("keydown", handleEscape);
    }

    return () => document.removeEventListener("keydown", handleEscape)
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
              onClick={
                profileType === "own" ? handleEditProfile
                : profileType === "friend" ? handleMessageFriend
                : null
              }
            >
              {
                profileType === "own" ? "Edit Profile"
                : profileType === "friend" ? "Message Friend"
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