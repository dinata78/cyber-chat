import { useEffect, useState } from "react"
import { CloseSVG, DownloadSVG, FileQuestionSVG, LinkSVG, OpenInNewSVG } from "../components/svg"

let previewImageGlobal = null;

export function previewImage(url) {
  previewImageGlobal?.(url);
}

export function ImagePreview() {
  const [ imageUrl, setImageUrl ] = useState(null);
  const [ imageSize, setImageSize ] = useState({ width: 0, height: 0 });
  const [ isDetailsVisible, setIsDetailsVisible ] = useState(false);

  const closeImagePreview = () => {
    setImageUrl(null);
    setIsDetailsVisible(false);
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
      console.log(image.filename)

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
        <div className="wrapper">
          <button
            title="View Details" 
            style={{
              fill: isDetailsVisible && "white"
            }}
            onClick={() => setIsDetailsVisible(prev => !prev)}
          >
            <FileQuestionSVG />
          </button>

          <button title="Open in Browser">
            <OpenInNewSVG />
          </button>

          <button title="Copy Link">
            <LinkSVG />
          </button>

          <button title="Download">
            <DownloadSVG />
          </button>
        </div>

        <div className="wrapper">
          <button title="Close" onClick={closeImagePreview}>
            <CloseSVG />
          </button>
        </div>

        {
          isDetailsVisible &&
          <div className="details-container">
            <div className="detail">
              <span>
                Filename
              </span>
              <span>
                {"image-name.jpg"}
              </span>
            </div>
            <div className="detail">
              <span>Type</span>
              <span>Image (webp)</span>
            </div>
            <div className="detail">
              <span>Resolution</span>
              <span>{imageSize.width} x {imageSize.height}</span>
            </div>
            <div className="detail">
              <span>Size</span>
              <span>53.62 KB</span>
            </div>
          </div>
        }
      </div>

      <img
        src={imageUrl}
        onClick={(e) => e.stopPropagation()}
      />

    </div>
  )
}