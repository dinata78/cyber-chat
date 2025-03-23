import { useEffect, useRef, useState } from "react";
import { processDate } from "../../../utils";
import { MoreSVG } from "../../svg/MoreSVG";

export function MessageCard({ senderName, isSending, content, timeCreated, isUnread, isOwnMessage, selectedChatUid, prevSelectedChatUid }) {
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  const [featuresContainerPosition, setFeaturesContainerPosition] = useState({top: null, bottom: null, right: null});

  const featuresContainerRef = useRef(null);

  const showFeatures = (e) => {
    let topPosition = null;
    let bottomPosition = null;
    let rightPosition = window.innerWidth - e.clientX + 10;

    if (e.clientY <= window.innerHeight / 2) topPosition = e.clientY + 10;
    else bottomPosition = window.innerHeight - e.clientY + 10;

    setFeaturesContainerPosition({top: topPosition, bottom: bottomPosition, right: rightPosition });
    setIsFeaturesVisible(true);
  }

  useEffect(() => {
    const handleMousedown = (e) => {
      if (featuresContainerRef.current && !featuresContainerRef.current.contains(e.target)) {
        setIsFeaturesVisible(false);
      }
    }

    const handleResize = () => {
      setIsFeaturesVisible(false);
    }

    const preventScroll = (e) => {
      e.preventDefault();
    }
    
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

  return (
    <div className={isOwnMessage ? "message-card own" : "message-card"}>
      
      {
        isOwnMessage &&
        <button className="features-button" onClick={showFeatures}>
          <MoreSVG />
        </button>
      }

      {
        isFeaturesVisible &&
        <div 
          className="features-container"
          style={{position: "fixed", top: featuresContainerPosition.top, bottom: featuresContainerPosition.bottom, right: featuresContainerPosition.right}}
          ref={featuresContainerRef}
        >
          <button>Edit</button>
          <button>Delete</button>
        </div>
      }

      <div className={isOwnMessage ? "container own" : "container"}>

        <div className={isOwnMessage ? "sender-name own" : "sender-name"}>
          {senderName}
        </div>

        <div className={isOwnMessage && isSending ? "content own sending" : isOwnMessage ? "content own" : "content"}>
          {content}
        </div>

        <div className="time">
          {processDate(timeCreated.toDate())}
        </div>

        {
          !isOwnMessage && isUnread && selectedChatUid !== prevSelectedChatUid.current  &&
          <label className="unread-indicator" title="Unread message">!</label>
        }

      </div>
      
    </div>
 )
}