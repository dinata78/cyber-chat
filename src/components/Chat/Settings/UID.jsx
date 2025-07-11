import { useState } from "react";
import { notify } from "../../Notification";
import { CheckSVG, CopySVG } from "../../svg";

export function UID({ ownUid }) {
  const [ isUidCopied, setIsUidCopied ] = useState(false);

  const copyUid = async () => {
    if (isUidCopied) return;

    try {
      await navigator.clipboard.writeText(ownUid);
      setIsUidCopied(true);
      notify("text-copied", "Copied UID to clipboard!");
    }
    catch (error) {
      console.error("Error: Failed to copy UID.");
      console.error(error);
      notify(null, "Failed to copy UID.");
    }
  }

  return (
    <>
      <label>UID</label>

      <div className="segment">
        <span>{ownUid || "Loading..."}</span>
        <button
          style={{
            width: "max-content",
            height: "max-content",
            padding: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fill: "#bbd"
          }}
          onClick={copyUid}
        >
          {!isUidCopied ? <CopySVG /> : <CheckSVG />}
        </button>
      </div>

      <span className="info">
        Your unique user ID. Others can add you by using this ID.
      </span>
    </>
  )
}