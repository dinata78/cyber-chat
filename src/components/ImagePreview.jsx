import { useEffect, useState } from "react"
import { CloseSVG, DownloadSVG, FileQuestionSVG, LinkCopiedSVG, LinkSVG, OpenInNewSVG } from "../components/svg"
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { notify } from "./Notification";

let previewImageGlobal = null;

export function previewImage(url) {
  previewImageGlobal?.(url);
}

export function ImagePreview() {
  const [ url, setUrl ] = useState(null);
  const [ isLinkCopied, setIsLinkCopied ] = useState(false);
  const [ resolution, setResolution ] = useState({ width: 0, height: 0 });
  const [ detailsMap, setDetailsMap ] = useState({});
  const [ isDetailsVisible, setIsDetailsVisible ] = useState(false);

  const isLocalImage = !url?.startsWith("https://");
  const currentImageDetails = detailsMap[url] || null;

  const closeImagePreview = () => {
    setUrl(null);
    setIsLinkCopied(false);
    setResolution({ width: 0, height: 0 });
    setIsDetailsVisible(false);
  }

  const copyLink = async () => {
    if (isLinkCopied) return;

    try {
      await navigator.clipboard.writeText(url);
      setIsLinkCopied(true);
      notify("text-copied", "Copied image link to clipboard!");
    }
    catch {
      console.error("Error: Failed to copy image link.");
      notify(null, "Failed to copy image link.");
    }
  }

  const openInBrowser = () => {
    window.open(url, "_blank");
  }

  const saveImage = async () => {
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = currentImageDetails?.name || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.removeObjectURL(downloadUrl);
  }

  const fetchAndSetDetails = async (url) => {
    if (!url) return;

    const imagesQueryRef = query(
      collection(db, "images"),
      where("url", "==", url),
      limit(1),
    );

    const imagesDocs = await getDocs(imagesQueryRef);

    if (imagesDocs.docs.length) {
      setDetailsMap(prev => {
        const map = {...prev};
        const data = imagesDocs.docs[0].data();
        map[url] = { name: data.name, sizeInBytes: data.sizeInBytes }
        return map;
      });
    }
  }

  const getImageFormat = (url) => {
    const split = url.split(".");
    return split[split.length - 1];
  }

  const stringifyBytes = (bytes) => {
    if (bytes < 1000) {
      return `${bytes} B`;
    }
    else if (bytes < 1000000) {
      const kilobytes = bytes / 1000;
      const roundedKilobytes = Math.round(kilobytes * 10) / 10;
      return `${roundedKilobytes} KB`;
    }
    else {
      const megabytes = bytes / 1000000;
      const roundedMegabytes = Math.round(megabytes * 10) / 10;

      return `${roundedMegabytes} MB`;
    }
  }

  useEffect(() => {
    previewImageGlobal = setUrl;

    return () => {
      previewImageGlobal = null;
    }
  }, []);

  useEffect(() => {
    const image = new Image();
    image.src = url;

    image.onload = () => {
      setResolution({
        width: image.width,
        height: image.height,
      });
    }

    if (!detailsMap[url]) {
      fetchAndSetDetails(url);
    }
  }, [url]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeImagePreview();
      }
    }

    if (url) {
      document.addEventListener("keydown", handleEscape);
    }
    else {
      document.removeEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    }
  }, [url]);

  if (!url) return null;

  return (
    <div
      id="image-preview"
      onClick={closeImagePreview}
    >
      <div
        className="menu"
        onClick={(e) => e.stopPropagation()}
      >
        {
          !isLocalImage &&
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

            <button title="Open in Browser" onClick={openInBrowser}>
              <OpenInNewSVG />
            </button>

            <button
              title={!isLinkCopied ? "Copy Link" : "Link Copied"}
              onClick={copyLink}
            >
              {!isLinkCopied ? <LinkSVG /> : <LinkCopiedSVG />}
            </button>

            <button title="Save Image" onClick={saveImage}>
              <DownloadSVG />
            </button>
          </div>
        }

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
                {currentImageDetails?.name}
              </span>
            </div>
            <div className="detail">
              <span>Type</span>
              <span>Image ({getImageFormat(url).toUpperCase()})</span>
            </div>
            <div className="detail">
              <span>Resolution</span>
              <span>{resolution.width} x {resolution.height}</span>
            </div>
            <div className="detail">
              <span>Size</span>
              <span>{stringifyBytes(currentImageDetails?.sizeInBytes)}</span>
            </div>
          </div>
        }
      </div>

      <img
        src={url}
        onClick={(e) => e.stopPropagation()}
      />

    </div>
  )
}