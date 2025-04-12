import { useNavigate } from "react-router-dom";
import { getIndicatorClass } from "../../../../utils";
import { addInbox } from "../addInbox";
import { removeFriend } from "../modifyFriendList";
import { useState } from "react";
import { PopUp } from "../../../PopUp";
import { AccountMinusSVG, ChatSVG } from "../../../svg";

export function FriendCard({ ownUid, friendUid, friendDisplayName, friendUsername, friendTitle, friendStatus, friendPfpUrl, setSelectedChatUid }) {
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [popUpData, setPopUpData] = useState({caption: "", textContent: "", hasTwoButtons: false, firstButton: {}, secondButton: {}});

  const navigate = useNavigate();

  const chatFriend = (friendUid) => {
    setSelectedChatUid(friendUid);
    navigate("/cyber/chats");
  }

  const handleRemoveFriend = async () => {
    setIsPopUpVisible(false);

    await removeFriend(ownUid, friendUid);
    await addInbox(ownUid, "friend-removed", friendUid);
    await addInbox(friendUid, "friend-removed", ownUid);
  }

  const removeFriendButtonOnClick = () => {
    setPopUpData((prev) => {
      return {
        ...prev,
        caption: "Remove Friend",
        textContent: `Remove [ ${friendDisplayName} (@${friendUsername}) ] from your friend list? `,
        hasTwoButtons: true,
        firstButton: {label: "Remove friend", function: handleRemoveFriend},
        secondButton: {label: "Cancel", function: () => setIsPopUpVisible(false)}
      };
    });

    setIsPopUpVisible(true);    
  } 

  return (
    <div className="friend-card">

      <div className="friend-card-pfp">
        <img src={friendPfpUrl || "/empty-pfp.webp"} />
        <div 
          className={
            getIndicatorClass(friendStatus)
          }
        >
        </div>
      </div>

      <div className="friend-card-info">
        <div>
          <span className="friend-card-name">{friendDisplayName}</span>
          <span className="friend-card-username">@{friendUsername}</span>
        </div>
        <span className="friend-card-title">{friendTitle}</span>
      </div>

      <div className="friend-card-buttons">
        <button title="Chat" onClick={() => chatFriend(friendUid)}>
          <ChatSVG />
        </button>
        <button title="Remove Friend" onClick={removeFriendButtonOnClick}>
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