import { useEffect, useRef, useState } from "react";
import { db } from "../../../../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { deleteImageFromDb } from "../../../../utils";
import { ImageEditSVG, TrashCanSVG } from "../../../svg";

export function AccountPfp({ pfpUrl, ownUid }) {
  const [chosenPfp, setChosenPfp] = useState(null);
  const [chosenPfpUrl, setChosenPfpUrl] = useState("");
  const [errorInfo, setErrorInfo] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const fileInputRef = useRef(null);

  const clearChosenPfp = () => {
    fileInputRef.current.value = null;
    setChosenPfp(null);
    setChosenPfpUrl("");
  }

  const uploadPfp = async () => {
    try {
      const formData = new FormData();
      formData.append("image", chosenPfp);
      formData.append("uid", ownUid);

      const response = await fetch(
        "https://cyberchat.mediastorage.workers.dev/image/pfp/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        const ownDocRef = doc(db, "users", ownUid);
        await updateDoc(ownDocRef, { pfpUrl: data.secure_url });
      }

      clearChosenPfp();
    }
    catch (error) {
      console.error("Error: " + error);
      setErrorInfo("Failed to set profile picture.");
      clearChosenPfp();
    }
  }

  const deletePfp = async () => {
    const success = await deleteImageFromDb(pfpUrl);

    try {
      if (success) {
        const ownDocRef = doc(db, "users", ownUid);
        await updateDoc(ownDocRef, { pfpUrl: "" });
      }
      else {
        setErrorInfo("Failed to delete profile picture.");
      }  
    }
    catch (error) {
      console.error("Error while deleting profile picture: " + error)
    }
    finally {
      setIsConfirmingDelete(false);
    }

  }

  useEffect(() => {
    let revokeURL = null;

    if (chosenPfp) {
      if (chosenPfp.size > 5 * 1000 * 1000) {
        setErrorInfo("Image size should be less than 10MB.");
        clearChosenPfp();
      }
      else {
        const url = URL.createObjectURL(chosenPfp);
        revokeURL = () => URL.revokeObjectURL(url);

        setChosenPfpUrl(url);
      }
    }

    return () => {
      if (revokeURL) revokeURL();
    }
  }, [chosenPfp])

  return (
    <div id="account-pfp">

      <img src={pfpUrl || "/empty-pfp.webp"} />

      {
        errorInfo &&
        <label className="error-info">{errorInfo}</label>
      }

      {
        isConfirmingDelete &&
        <div className="delete-pfp-confirmation">
          <label>DELETE PROFILE PICTURE?</label>
          <div className="buttons">
            <button
              style={{color: "lime"}}
              onClick={deletePfp}
            >
              YES
            </button>
            <button
              style={{color: "red"}}
              onClick={() => setIsConfirmingDelete(false)}
            >
              NO
            </button>
          </div>
        </div>
      }

      {
        pfpUrl &&
        <button
          className="delete-pfp"
          onClick={() => setIsConfirmingDelete(true)}
        >
          <TrashCanSVG />
        </button>
      }

      <button
        className="change-pfp"
        onClick={() => {
          setErrorInfo("");
          fileInputRef.current.click();
        }}
      >
        CHANGE IMAGE
        <ImageEditSVG />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        style={{display: "none", pointerEvents: "none"}}
        accept="image/jpg, image/jpeg, image/png, image/webp"
        onChange={(e) => setChosenPfp(e.target.files[0])}
      />

      {
        chosenPfp &&
        <div id="account-pfp-preview" onClick={clearChosenPfp}>
          <div className="main-container" onClick={(e) => e.stopPropagation()}>
            <img src={chosenPfpUrl} />
            <button onClick={uploadPfp}>CONFIRM IMAGE</button>
            <button onClick={() => fileInputRef.current.click()}>CHANGE IMAGE</button>
          </div>
        </div>
      }
    </div>

  )
}