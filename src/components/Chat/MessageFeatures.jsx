import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CopySVG, EditSVG, FlagSVG, ReplySVG, TrashCanSVG } from "../svg";

export function MessageFeatures({ cursorYPos, isOwn, handleEdit, handleDelete, handleCopyText }) {
  const [ featuresTopValue, setFeaturesTopValue ] = useState(0);

  const featuresRef = useRef(null);

  useLayoutEffect(() => {
    const featuresHeight = featuresRef.current.scrollHeight;

    if (cursorYPos > (featuresHeight + 100)) {
      setFeaturesTopValue(featuresHeight * -1 - 25);
    }
    else {
      setFeaturesTopValue(20);
    }
  }, []);

  useEffect(() => {
    const preventScroll = (e) => {
      e.preventDefault();
    }

    featuresRef.current.addEventListener("wheel", preventScroll, { passive: false });
    featuresRef.current.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      if (featuresRef?.current) {
        featuresRef.current.removeEventListener("wheel", preventScroll);
        featuresRef.current.removeEventListener("touchmove", preventScroll);
      }
    }
  }, []);

  return (
    <div
      ref={featuresRef}
      id="message-features"
      style={{
        top: `${featuresTopValue}px`
      }}
    >

      <button>
        Reply
        <ReplySVG />
      </button>

      <button onClick={handleCopyText}>
        Copy Text
        <CopySVG />
      </button>

      {
        isOwn ?
          <>
            <button onClick={handleEdit}>
              Edit
              <EditSVG />
            </button>

            <button style={{color: "red", fill: "red"}} onClick={handleDelete}>
              Delete
              <TrashCanSVG />
            </button>        
          </>
        : <button style={{color: "red", fill: "red"}}>
            Report
            <FlagSVG />
          </button>
      }

      
    </div>
  )
}