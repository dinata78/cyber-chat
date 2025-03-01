import { useNavigate } from "react-router-dom";
import { useOnlineStatus } from "../../../custom-hooks/useOnlineStatus";
import { getIndicatorClass } from "../../../utils";
import { AccountMinusSVG } from "../../svg/AccountMinusSVG";
import { ChatSVG } from "../../svg/ChatSVG";
import { addInbox } from "./addInbox";
import { removeFriend } from "./removeFriend";
import { useName } from "../../../custom-hooks/useName";
import { useState } from "react";
import { PopUp } from "../../PopUp";

export function FriendCard({ ownUid, friendUid, friendName, friendTitle, setSelectedChatUid }) {
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [popUpData, setPopUpData] = useState({caption: "", textContent: "", hasTwoButtons: false, firstButton: {}, secondButton: {}}); 

  const { onlineStatus } = useOnlineStatus(friendUid);
  const { username } = useName(friendUid);

  const navigate = useNavigate();

  const chatFriend = (friendUid) => {
    setSelectedChatUid(friendUid);
    navigate("/cyber/chats");
  }

  const friendRemove = async () => {
    setIsPopUpVisible(false);

    await removeFriend(ownUid, friendUid);
    await removeFriend(friendUid, ownUid);
    await addInbox(ownUid, "friend-removed", friendUid);
    await addInbox(friendUid, "friend-removed", ownUid);
  }

  const friendRemovebuttonOnClick = () => {
    setPopUpData((prev) => {
      return {
        ...prev,
        caption: "Remove Friend",
        textContent: `Remove [ ${friendName} (@${username}) ] from your friend list? `,
        hasTwoButtons: true,
        firstButton: {label: "Remove friend", function: friendRemove},
        secondButton: {label: "Cancel", function: () => setIsPopUpVisible(false)}
      };
    });

    setIsPopUpVisible(true);    
  } 


  if (!username) return;

  return (
    <div className="friend-card">

      <div className="friend-card-pfp">
        <img src="/empty-pfp.webp" />
        <div 
          className={
            getIndicatorClass(onlineStatus)
          }
        >
        </div>
      </div>

      <div className="friend-card-info">
        <div>
          <span className="friend-card-name">{friendName}</span>
          <span className="friend-card-username">@{username}</span>
        </div>
        <span className="friend-card-title">{friendTitle}</span>
      </div>

      <div className="friend-card-buttons">
        <button title="Chat" onClick={() => chatFriend(friendUid)}>
          <ChatSVG />
        </button>
        <button title="Remove Friend" onClick={friendRemovebuttonOnClick}>
          <AccountMinusSVG />
        </button>
      </div>

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