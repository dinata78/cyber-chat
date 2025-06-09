import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CopySVG, EditSVG, FlagSVG, ReplySVG, TrashCanSVG } from "../../svg";

export function MessageFeatures({ cursorYPos, isOwn, type, handleReply, handleCopyText, handleEdit, handleDelete, handleReport }) {
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

      <button onClick={handleReply}>
        Reply
        <ReplySVG />
      </button>

      {
        type === "text" &&
        <button onClick={handleCopyText}>
          Copy Text
          <CopySVG />
        </button>
      }

      {
        isOwn && type === "text"&&
        <button onClick={handleEdit}>
          Edit
          <EditSVG />
        </button>
      }

      {
        isOwn &&
        <button style={{color: "red", fill: "red"}} onClick={handleDelete}>
          Delete
          <TrashCanSVG />
        </button>
      }

      {
        !isOwn &&
        <button style={{color: "red", fill: "red"}} onClick={handleReport}>
          Report
          <FlagSVG />
        </button>
      }
      
    </div>
  )
}