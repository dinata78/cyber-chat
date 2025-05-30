import { useEffect, useState } from "react"

let previewImageGlobal = null;

export function previewImage(url) {
  previewImageGlobal?.(url);
}

export function ImagePreview() {
  const [ isFit, setIsFit ] = useState(true);
  const [ imageUrl, setImageUrl ] = useState(null);
  const [ imageSize, setImageSize ] = useState({ width: 0, height: 0 });

  const closeImagePreview = () => {
    setImageUrl(null);
  }

  useEffect(() => {
    previewImageGlobal = setImageUrl;

    return () => {
      previewImageGlobal = null;
    }
  }, []);

  useEffect(() => {
    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      setImageSize({
        width: image.width,
        height: image.height,
      })
    }
  }, [imageUrl]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeImagePreview();
      }
    }

    if (imageUrl) {
      document.addEventListener("keydown", handleEscape);
    }
    else {
      document.removeEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    }
  }, [imageUrl]);

  if (!imageUrl) return null;

  return (
    <div
      id="image-preview"
      onClick={closeImagePreview}
    >
      <div
        className="menu"
        onClick={(e) => e.stopPropagation()}
      >
        <span>
          Actual Size: {imageSize.width || "?"} x {imageSize.height || "?"}
        </span>

        <label>
          <input
            type="checkbox"
            checked={isFit}
            onChange={() => setIsFit(prev => !prev)}
          />
          Fit to screen
        </label>
      </div>

      <img
        style={{
          maxWidth: isFit && "80vw",
          maxHeight: isFit && "80vh"
        }}
        src={imageUrl}
        onClick={(e) => e.stopPropagation()}
      />

    </div>
  )
}