import { useEffect, useRef, useState } from "react";
import { ImageEditSVG } from "../../../svg/ImageEditSVG";
import { db } from "../../../../../firebase";
import { doc, updateDoc } from "firebase/firestore";

export function AccountPfp({ pfpUrl, ownUid }) {
  const [chosenImage, setChosenImage] = useState(null);
  const [chosenImageUrl, setChosenImageUrl] = useState(null);

  const fileInputRef = useRef(null);

  const clearChosenImage = () => {
    fileInputRef.current.value = null;
    setChosenImage(null);
  }

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append("image", chosenImage);
      formData.append("uid", ownUid);

      const response = await fetch(
        "https://cyber-chat-worker.stevendinata78.workers.dev/image/pfp/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        const ownDocRef = doc(db,"users", ownUid);
        await updateDoc(ownDocRef, { pfpUrl: data.secure_url });
      }

      clearChosenImage();
    }
    catch (error) {
      console.error("Erroxr: " + error);
      clearChosenImage();
    }
  }

  useEffect(() => {
    if (chosenImage) {
      const url = URL.createObjectURL(chosenImage);
      setChosenImageUrl(url);
    }

    return () => URL.revokeObjectURL(chosenImage);
  }, [chosenImage]);

  return (
    <div id="account-pfp">

      <img src={pfpUrl || "/empty-pfp.webp"} />
      <button onClick={() => fileInputRef.current.click()}>
        CHANGE IMAGE
        <ImageEditSVG />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        style={{display: "none", pointerEvents: "none"}}
        accept="image/jpg, image/jpeg, image/png, image/webp"
        onChange={(e) => setChosenImage(e.target.files[0])}
      />

      {
        chosenImage &&
        <div id="account-pfp-preview"onClick={clearChosenImage}>
          <div className="main-container" onClick={(e) => e.stopPropagation()}>
            <img src={chosenImageUrl}/>
            <button onClick={uploadImage}>CONFIRM IMAGE</button>
            <button onClick={() => fileInputRef.current.click()}>CHANGE IMAGE</button>
          </div>
        </div>
      }
    </div>

  )
}