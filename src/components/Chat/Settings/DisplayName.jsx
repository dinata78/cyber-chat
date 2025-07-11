import { useEffect, useRef, useState } from "react"
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

export function DisplayName({ ownUid, ownDisplayName }) {
  const [ isEditing, setIsEditing ] = useState(false);
  const [ editedValue, setEditedValue ] = useState(ownDisplayName);
  const [ errorInfo, setErrorInfo ] = useState("");

  const inputRef = useRef(null);

  const inputOnChange = (e) => {
    setErrorInfo("");

    const filtered = e.target.value.replace(/\s+/g, " ");
    
    if (filtered.length <= 25) {
      setEditedValue(filtered);
    }
  }

  const updateDisplayName = async () => {
    setErrorInfo("");

    const filtered = editedValue.trim();

    if (filtered === ownDisplayName) {
      setEditedValue(ownDisplayName);
      setIsEditing(false);
      return;
    }

    if (!filtered.length) {
      setErrorInfo("Display name can't be empty.");
      return;
    }

    const ownDocRef = doc(db, "users", ownUid);

    await updateDoc(ownDocRef, { displayName: filtered });

    setIsEditing(false);
  }

  useEffect(() => {
    setEditedValue(ownDisplayName);
  }, [ownDisplayName]);

  return (
    <>
      <label>DISPLAY NAME</label>

      <div className="segment">
        {
          !isEditing ?
            <span className="text-overflow-support">
              {ownDisplayName || "Loading..."}
            </span>
          : <input
              ref={inputRef}
              type="text"
              placeholder={ownDisplayName}
              value={editedValue}
              onChange={inputOnChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  updateDisplayName();
                }
              }}
            />
        }

        {
          !isEditing ?
            <button
              onClick={() => {
                setErrorInfo("");
                setIsEditing(true);
                requestAnimationFrame(() => {
                  inputRef.current.focus();   
                })
              }}
            >
              Edit
            </button>
          : <>
              <button
                style={{backgroundColor: "#336633", color: "lime"}}
                onClick={updateDisplayName}
              >
                Save
              </button>
              <button
                style={{color: "red"}}
                onClick={() => {
                  setErrorInfo("");
                  setEditedValue(ownDisplayName);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </>
        }
      </div>

      <span className="info">
        Your display name is shared publicly with others. Maximum length is 25 characters.
      </span>

      {
        errorInfo &&
        <span className="info" style={{color: "#d00", marginTop: "8px"}}>
          {errorInfo}
        </span>
      }
    </>
  )
}