import { ToggleSwitch } from "./ToggleSwitch";
import { onDisconnect, ref, update } from "firebase/database";
import { realtimeDb } from "../../../../firebase";

export function StatusVisibility({ ownUid, ownStatus }) {

  const updateStatus = async () => {
    const ownStatusRef = ref(realtimeDb, `users/${ownUid}`);

    if (ownStatus === "hidden") {
      onDisconnect(ownStatusRef).update({ status: "offline" });
      await update(ownStatusRef, { status: "online" });
    }
    else {
      onDisconnect(ownStatusRef).cancel();
      await update(ownStatusRef, { status: "hidden" });
    }
  }
  
  return (
    <>
      <label>STATUS VISIBILITY</label>

      <div className="segment">
        <span style={{color: "#bbc"}}>
          Allow others to see your online status.
        </span>
        <ToggleSwitch
          toggleState={ownStatus !== "hidden"}
          toggleFunction={updateStatus}
        />
      </div>
    </>
  )
}