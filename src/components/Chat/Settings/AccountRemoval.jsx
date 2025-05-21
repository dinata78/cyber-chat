import { useRef, useState } from "react";
import { AccountRemovalModal } from "./AccountRemovalModal";

export function AccountRemoval() {
  const [ isDeleting, setIsDeleting ] = useState(false);

  const inputRef = useRef(null);
  
  return (
    <>
      <label>ACCOUNT REMOVAL</label>

      <div className="segment">
        <span style={{color: "#bbc"}}>
          Permanently delete your account.
        </span>
        <button
          style={{backgroundColor: "#900"}}
          onClick={() => {
            setIsDeleting(true);
            requestAnimationFrame(() => {
              inputRef.current.focus();
            })
          }}
        >
          Delete
        </button>
      </div>

      {
        isDeleting &&
        <AccountRemovalModal
          closeModal={() => setIsDeleting(false)}
          inputRef={inputRef}
        />
      }
    </>
  )
}