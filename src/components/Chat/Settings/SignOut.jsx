import { useState } from "react"
import { get, ref, update } from "firebase/database";
import { auth, realtimeDb } from "../../../../firebase";
import { signOut } from "firebase/auth";

export function SignOut() {
  const [ isConfirmingSignOut, setIsConfirmingSignOut ] = useState(false);

  const buttonOnClick = async () => {
    if (!isConfirmingSignOut) setIsConfirmingSignOut(true);
    else {
      const statusRef = ref(realtimeDb, `users/${auth.currentUser.uid}`);

      const currentStatus = await get(statusRef); 

      if (currentStatus.val()?.status !== "hidden") {
        await update(statusRef, { status: "offline" });
      };

      await signOut(auth);
    }
  }

  return (
    <>
      <label>SIGN OUT</label>

      <div className="segment">
        <span style={{color: "#bbc"}}>
          Log you out from your current session.
        </span>
        <button
          style={{
            backgroundColor: isConfirmingSignOut ? "#ff000077" : null,
            color: isConfirmingSignOut ? "white" : null
          }}
          onClick={buttonOnClick}
        >
          {!isConfirmingSignOut ? "Log Out" : "Confirm"}
        </button>
      </div>
    </>
  )
}