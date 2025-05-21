import { useLayoutEffect, useRef, useState } from "react";
import { CopySVG, EditSVG, FlagSVG, ReplySVG, TrashCanSVG } from "../svg";

export function MessageFeatures({ isOwn }) {
  const [ featuresHeight, setFeaturesHeight ] = useState(0);

  const featuresRef = useRef(null);

  useLayoutEffect(() => {
    setFeaturesHeight(featuresRef.current.scrollHeight);
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
            <button>
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