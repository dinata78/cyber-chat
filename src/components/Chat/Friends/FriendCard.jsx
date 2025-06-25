import { addDoc, collection, deleteDoc, getDocs, limit, query, where } from "firebase/firestore";
import { getIndicatorClass } from "../../../utils";
import { AccountMinusSVG, ChatSVG } from "../../svg";
import { db } from "../../../../firebase";

export function FriendCard({ ownUid, friendUid, friendDisplayName, friendUsername, friendStatus, friendPfpUrl, setSelectedChatUid, setIsSidebarVisible, conversationId, isInDM }) {

  const chatFriend = async () => {
    if (!isInDM) {
      const activeDMRef = collection(db, "users", ownUid, "activeDM");
      await addDoc(activeDMRef, { conversationId: conversationId });
    }
    setSelectedChatUid(friendUid);
    setIsSidebarVisible(false);
  }

  const handleRemoveFriend = async () => {

  }

  return (
    <div className="friend-card" tabIndex={0}>

      <div className="pfp">
        <img src={friendPfpUrl || "/empty-pfp.webp"} />
        <div className={getIndicatorClass(friendStatus)}></div>
      </div>

      <div className="name">
        <span className="display-name text-overflow-support">
          {friendDisplayName}
        </span>
        <span className="username text-overflow-support">
          @{friendUsername}
        </span>
      </div>

      <div className="buttons">
        <button onClick={chatFriend}>
          <ChatSVG />
        </button>
        <button onClick={handleRemoveFriend}>
          <AccountMinusSVG />
        </button>
      </div>
      
    </div>
  )
}