import { useEffect } from "react";

export function useAutoHideFeatures(featuresRef, isFeaturesVisible, setIsFeaturesVisible) {
  const handleMousedown = (e) => {
    if (
      featuresRef.current && 
      !featuresRef.current.contains(e.target)
    ) {
      setIsFeaturesVisible(false);
    }
  }

  const handleResize = () => {
    setIsFeaturesVisible(false);
  }

  const preventScroll = (e) => {
    e.preventDefault();
  }

  useEffect(() => {
    if (isFeaturesVisible) {
      document.addEventListener("mousedown", handleMousedown);
      window.addEventListener("resize", handleResize);
      window.addEventListener("wheel", preventScroll, { passive: false });
      window.addEventListener("touchmove", preventScroll, { passive: false });
    }
    else {
      document.removeEventListener("mousedown", handleMousedown);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleMousedown);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    }

  }, [isFeaturesVisible]);
}