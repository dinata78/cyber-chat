import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useUnreadInbox(userData) {
  const [unreadInboxIds, setUnreadInboxIds] = useState([]);
  
  const userUid = userData.uid;
  const userInbox = userData.inbox;

  useEffect(() => {
    if (userData.inbox === undefined) return;

    const unreadInboxItems = userInbox.filter((item) => item.isUnread);
    const unreadInboxIds = unreadInboxItems.map((item) => item.id);
    setUnreadInboxIds(unreadInboxIds);

    const allReadInboxItems = userInbox.map((item) => {
      if (!item.isUnread) {
        return item;
      }
      else {
        return {
          ...item,
          isUnread: false,
        }
      }
    });

    const userDocRef = doc(db, "users", userUid);

    updateDoc(userDocRef, {
      ...userData,
      inbox: allReadInboxItems,
    });

  }, [userData.inbox?.length]);

  return { unreadInboxIds }

}