import { collection, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../../../../../firebase";
import { TrashCanSVG } from "../../../svg/TrashCanSVG";
import { InboxCard } from "./InboxCard";
import { useState } from "react";
import { PopUp } from "../../../PopUp";
import { FriendsEmptyUI } from "../FriendsEmptyUI";
import { useUnreadInbox } from "../../../../custom-hooks/useUnreadInbox";

export function FriendsInbox({ ownUid, inboxItems }) {
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [popUpData, setPopUpData] = useState({caption: "", textContent: "", hasTwoButtons: false, firstButton: {}, secondButton: {}}); 

  const { unreadInboxIds } = useUnreadInbox(ownUid, inboxItems?.length);

  const clearInbox = async () => {
    const inboxRef = collection(db, "users", ownUid, "inbox");
    const batch = writeBatch(db);

    try {
      const inboxItems = await getDocs(inboxRef);
      inboxItems.docs.forEach(item => {
        batch.delete(item.ref);
      });

      await batch.commit();
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setIsPopUpVisible(false);
    }
  }

  const clearInboxButtonOnClick = () => {
    setPopUpData((prev) => {
      return {
        ...prev,
        caption: "Clear Inbox",
        textContent: "Clear all items in inbox?",
        hasTwoButtons: true,
        firstButton: {label: "Clear inbox", function: clearInbox},
        secondButton: {label: "Cancel", function: () => setIsPopUpVisible(false)}
      }
    });

    setIsPopUpVisible(true);
  }
  
  return (
    <div id="friends-inbox">

      <div className="top">
        <h1>Inbox - {inboxItems.length}</h1>
        <button onClick={clearInboxButtonOnClick}>
          <TrashCanSVG />
          Clear Inbox
        </button>
      </div>

      {
        inboxItems.length > 0 ?
          <div className="inbox-cards overflow-y-support">
            {
              inboxItems.map((item, index) => {
                return (
                  <InboxCard
                    key={index + item.timeCreated + index}
                    content={item.content}
                    timeCreated={item.timeCreated}
                    isUnread={unreadInboxIds.includes(item.id)}
                  />
                )
              })
            }
          </div>
        : <FriendsEmptyUI type="inbox" />
      }

      {
        isPopUpVisible &&
        <PopUp
          closePopUp={() => setIsPopUpVisible(false)}
          caption={popUpData.caption}
          textContent={popUpData.textContent}
          hasTwoButtons={popUpData.hasTwoButtons}
          firstButton={popUpData.firstButton}
          secondButton={popUpData.secondButton}
        />
      }
      
    </div>
  )
}