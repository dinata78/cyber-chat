import { useEffect } from "react";

export function useGenerateImgUrl(imgFile, setImgUrl, clearImgFile, setErrorInfo) {
  useEffect(() => {
    let revokeURL = null;

    if (imgFile) {
      if (imgFile.size > 5 * 1000 * 1000) {
        clearImgFile();

        if (setErrorInfo) setErrorInfo("Image size should be less than or equal to 10MB.");
      }
      else {
        const url = URL.createObjectURL(imgFile);
        revokeURL = () => URL.revokeObjectURL(url);

        setImgUrl(url);
      }
    }

    return () => {
      if (revokeURL) revokeURL();
    }
  }, [imgFile]);
}