import { useEffect, useRef, useState } from "react";
import { ImageEditSVG } from "../../../svg/ImageEditSVG";

export function AccountPfp({ pfpUrl }) {
  const [chosenImage, setChosenImage] = useState(null);
  const [chosenImageUrl, setChosenImageUrl] = useState(null);

  const fileInputRef = useRef(null);

  const clearChosenImage = () => {
    fileInputRef.current.value = null;
    setChosenImage(null);
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
            <button>CONFIRM IMAGE</button>
            <button onClick={() => fileInputRef.current.click()}>CHANGE IMAGE</button>
          </div>
        </div>
      }
    </div>

  )
}