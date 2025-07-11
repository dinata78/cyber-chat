import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react"
import { db } from "../../../../firebase";

export function Bio({ ownUid, ownBio }) {
  const [ isEditing, setIsEditing ] = useState(false);
  const [ editedValue, setEditedValue ] = useState(ownBio);
  const [ errorInfo, setErrorInfo ] = useState("");

  const inputRef = useRef(null);

  const inputOnChange = (e) => {
    setErrorInfo("");

    const filtered = e.target.value.replace(/\s+/g, " ");

    if (filtered.length <= 250) {
      setEditedValue(filtered);
    }
  }

  const updateBio = async () => {
    setErrorInfo("");

    const filtered = editedValue.trim();

    if (filtered === ownBio) {
      setEditedValue(ownBio);
      setIsEditing(false);
      return;
    }

    const ownDocRef = doc(db, "users", ownUid);

    await updateDoc(ownDocRef, { bio: filtered });

    setIsEditing(false);
  }

  const resizeInput = () => {
    inputRef.current.style.height = "auto";
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
  }

  const moveInputCursorToEnd = () => {
    inputRef.current.selectionStart = inputRef.current.value.length;
    inputRef.current.selectionEnd = inputRef.current.value.length;
  }

  useEffect(() => {
    setEditedValue(ownBio);
  }, [ownBio]);

  return (
    <>
      <label style={{marginBottom: "6px"}}>BIO</label>

      <div className="segment" style={{alignItems: "flex-start"}}>
        {
          !isEditing ?
            <span>
              {
                ownBio === "" ? "(Not Set)"
                : ownBio || "Loading..."
              }
            </span>
          : <textarea
              ref={inputRef}
              rows={1}
              placeholder={ownBio}
              value={editedValue}
              onChange={inputOnChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  updateBio();
                }
              }}
              onInput={resizeInput}
            >

            </textarea>
        }

        {
          !isEditing ?
            <button
              onClick={() => {
                setErrorInfo("");
                setIsEditing(true);
                requestAnimationFrame(() => {
                  resizeInput();
                  inputRef.current.focus();
                  moveInputCursorToEnd();
                });
              }}
            >
              Edit
            </button>
          : <>
              <button
                style={{backgroundColor: "#336633", color: "lime"}}
                onClick={updateBio}
              >
                Save
              </button>
              <button
                style={{color: "red"}}
                onClick={() => {
                  setErrorInfo("");
                  setEditedValue(ownBio);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </>
        }
      </div>

      <span className="info">
        Your bio is shared publicly with others. Maximum length is 250 characters.
      </span>

      {
        errorInfo &&
        <span className="info" style={{marginTop: "8px", color: "red"}} >
          {errorInfo}
        </span>
      }
    </>
  )
}