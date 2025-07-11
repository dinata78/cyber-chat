import { collection, doc, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react"
import { db } from "../../../../firebase";

export function Username({ ownUid, ownUsername }) {
  const [ isEditing, setIsEditing ] = useState(false);
  const [ editedValue, setEditedValue ] = useState(ownUsername);
  const [ errorInfo, setErrorInfo ] = useState("");

  const inputRef = useRef(null);

  const inputOnChange = (e) => {
    setErrorInfo("");

    const filtered = e.target.value
      .replaceAll(" ", "").toLowerCase()
      .replace(/[^A-Za-z]/g, "");

    if (filtered.length <= 15) {
      setEditedValue(filtered);
    }
  }

  const updateUsername = async () => {
    setErrorInfo("");

    if (editedValue === ownUsername) {
      setIsEditing(false);
      return;
    }

    if (!editedValue.length) {
      setErrorInfo("Username can't be empty.");
      return;
    }

    const newUsernameQuery = query(
      collection(db, "users"),
      where("username", "==", editedValue),
      limit(1)
    );

    const newUsernameDocs = await getDocs(newUsernameQuery);
    
    if (newUsernameDocs.docs.length) {
      setErrorInfo("Username already exists.");
    }
    else {
      const ownDocRef = doc(db, "users", ownUid);
      await updateDoc(ownDocRef, { username: editedValue });

      setIsEditing(false);
    }
  }

  useEffect(() => {
    setEditedValue(ownUsername)
  }, [ownUsername]);
  
  return (
    <>
      <label>USERNAME</label>

      <div className="segment">
        {
          !isEditing ?
            <span className="text-overflow-support">
              {
                ownUsername === "" ? "(Not Set)"
                : ownUsername || "Loading..."
              }
            </span>
          : <input
              ref={inputRef}
              type="text"
              placeholder={ownUsername}
              value={editedValue}
              onChange={inputOnChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  updateUsername();
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
                });
              }}
            >
              Edit
            </button>
          : <>
              <button
                style={{backgroundColor: "#336633", color: "lime"}}
                onClick={updateUsername}
              >
                Save
              </button>
              <button
                style={{color: "red"}}
                onClick={() => {
                  setErrorInfo("");
                  setEditedValue(ownUsername);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </>
        }
      </div>

      <span className="info">
        You can let others add you by giving them your username. Maximum length is 15 characters.
      </span>

      { 
        errorInfo &&
        <span className="info" style={{marginTop: "8px", color: "#d00"}}>
          {errorInfo}
        </span>
      }
    </>
  )
}