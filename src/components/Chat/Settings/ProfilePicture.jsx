import { useRef, useState } from "react"
import { useGenerateImgUrl } from "../../../custom-hooks/useGenerateImgUrl";
import { addDoc, collection, deleteDoc, doc, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../../../firebase";
import { deleteImageFromDb } from "../../../utils";
import { previewImage } from "../../ImagePreview";

export function ProfilePicture({ ownUid, ownPfpUrl }) {
  const [ chosenPfpFile, setChosenPfpFile ] = useState(null);
  const [ chosenPfpUrl, setChosenPfpUrl ] = useState("");
  const [ errorInfo, setErrorInfo ] = useState("");
  const [ isRemovingPfp, setIsRemovingPfp ] = useState("");

  const fileInputRef = useRef(null);

  const changePfp = () => {
    setErrorInfo("");
    fileInputRef.current.click();
  }

  const clearChosenPfp = () => {
    fileInputRef.current.value = null;
    setChosenPfpFile(null);
    setChosenPfpUrl("");
  }

  const uploadPfp = async () => {
    try {
      const formData = new FormData();
      formData.append("image", chosenPfpFile);
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
        const imagesRef = collection(db, "images");
        await updateDoc(ownDocRef, { pfpUrl: data.secure_url });
        await addDoc(imagesRef, {
          url: data.secure_url,
          name: chosenPfpFile.name,
          sizeInBytes: chosenPfpFile.size, 
        });
      }

      if (ownPfpUrl) {
        const imagesQueryRef = query(
          collection(db, "images"),
          where("url", "==", ownPfpUrl),
          limit(1),
        );

        const imagesDocs = await getDocs(imagesQueryRef);

        if (imagesDocs.docs.length) {
          await deleteDoc(imagesDocs.docs[0].ref);
        }
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
    const success = await deleteImageFromDb(ownPfpUrl);

    try {
      if (success) {
        const ownDocRef = doc(db, "users", ownUid);
        const imagesQueryRef = query(
          collection(db, "images"),
          where("url", "==", ownPfpUrl),
          limit(1),
        )
        const imagesDocs = await getDocs(imagesQueryRef);

        await updateDoc(ownDocRef, { pfpUrl: "" });

        if (imagesDocs.docs.length) {
          await deleteDoc(imagesDocs.docs[0].ref);
        }
      }
      else {
        setErrorInfo("Failed to delete profile picture.");
      }  
    }
    catch (error) {
      console.error("Error while deleting profile picture: " + error)
    }
    finally {
      setIsRemovingPfp(false);
    }

  }

  useGenerateImgUrl(chosenPfpFile, setChosenPfpUrl, clearChosenPfp, setErrorInfo);

  return (
    <>
      <label>PROFILE PICTURE</label>

      {
        chosenPfpUrl || isRemovingPfp ?
          <div className="pfp">
            <img
              src={chosenPfpUrl || "/empty-pfp.webp"}
              style={{cursor: "pointer"}}
              onClick={() => previewImage(chosenPfpUrl || "/empty-pfp.webp")}
            />
            <button
              style={{backgroundColor: "#363", color: "lime"}}
              onClick={isRemovingPfp ? deletePfp : uploadPfp}
            >
              Save
            </button>
            <button
              style={{color: "red"}}
              onClick={isRemovingPfp ? () => setIsRemovingPfp(false) : clearChosenPfp}
            >
              Cancel
            </button>
          </div>
        : <div className="pfp">
            <img
              src={ownPfpUrl || "/empty-pfp.webp"}
              alt="Profile Picture"
              style={{cursor: "pointer"}}
              onClick={() => previewImage(ownPfpUrl || "/empty-pfp.webp")}
            />
            <button onClick={changePfp}>
              Change
            </button>
            {
            ownPfpUrl &&
            <button 
              onClick={() => {
                setErrorInfo("");
                setIsRemovingPfp(true);
              }}
            >
              Remove
            </button>
            }
          </div>
      }

      <span className="info">
        This is what is shown to others as your profile picture. Maximum image size is 10MB.
      </span>

      {
        errorInfo &&
        <span
          className="info"
          style={{marginTop: "8px", color: "#dd0000"}}
        >
          {errorInfo}
        </span>
      }

      <input
        ref={fileInputRef}
        type="file"
        style={{display: "none", pointerEvents: "none"}}
        accept="image/jpg, image/jpeg, image/png, image/webp"
        onChange={(e) => setChosenPfpFile(e.target.files[0])}
      />
    </>
  )
}