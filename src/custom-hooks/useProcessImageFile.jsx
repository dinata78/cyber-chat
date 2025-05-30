import { useEffect } from "react";
import { notify } from "../components/Notification";

export function useProcessImageFile(chosenImageFile, setChosenImageData, clearChosenImage) {

  useEffect(() => {
    let url = null;

    if (chosenImageFile) {
      if (chosenImageFile.size > 5 * 1000 * 1000) {
        notify(null, "File size exceeds 5MB.");
        clearChosenImage();
      }
      else {
        url = URL.createObjectURL(chosenImageFile);

        setChosenImageData({
          url: url,
          name: chosenImageFile.name,
        });
      }
    }
    else {
      clearChosenImage();
    }

    return () => {
      if (url) URL.revokeObjectURL(url);
    }
  }, [chosenImageFile]);

}