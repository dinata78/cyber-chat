import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CopySVG, EditSVG, FlagSVG, ReplySVG, TrashCanSVG } from "../svg";

export function MessageFeatures({ isOwn, handleEdit }) {
  const [ featuresHeight, setFeaturesHeight ] = useState(0);

  const featuresRef = useRef(null);

  useLayoutEffect(() => {
    setFeaturesHeight(featuresRef.current.scrollHeight);
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
      className="features"
      style={{
        top: `${featuresHeight * -1 - 25}px`
      }}
    >

      <button>
        Reply
        <ReplySVG />
      </button>

      <button>
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

            <button style={{color: "red", fill: "red"}}>
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