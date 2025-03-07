import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useUnreadFriendRequest(userData) {
  const [unreadRequestIds, setUnreadRequestIds] = useState([]);
  
  const userUid = userData.uid;
  const userRequest = userData.friendRequest;

  useEffect(() => {
    if (userData.friendRequest === undefined) return;

    const unreadRequest = userRequest.filter((request) => request.isUnread);
    const unreadRequestIds = unreadRequest.map((request) => request.id);
    setUnreadRequestIds(unreadRequestIds);

    const allReadRequest = userRequest.map((request) => {
      if (!request.isUnread) {
        return request;
      }
      else {
        return {
          ...request,
          isUnread: false,
        }
      }
    });

    const userDocRef = doc(db, "users", userUid);

    updateDoc(userDocRef, {
      ...userData,
      friendRequest: allReadRequest,
    });

  }, [userData.friendRequest?.length]);

  return { unreadRequestIds }

}