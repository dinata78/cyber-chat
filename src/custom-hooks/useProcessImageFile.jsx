import { useEffect } from "react";

export function useProcessImageFile(chosenImageFile, setChosenImageData, clearChosenImage) {

  useEffect(() => {
    let url = null;

    if (chosenImageFile) {
      url = URL.createObjectURL(chosenImageFile);

      setChosenImageData({
        url: url,
        name: chosenImageFile.name,
      });
    }
    else {
      clearChosenImage();
    }

    return () => {
      if (url) URL.revokeObjectURL(url);
    }
  }, [chosenImageFile]);

}