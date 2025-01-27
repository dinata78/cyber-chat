import { useState } from "react"
import { SearchSVG } from "../../svg/SearchSVG";
import { FriendsAll } from "./FriendsAll";
import { AddFriendModal } from "./AddFriendModal";
import { FriendsPending } from "./FriendsPending";
import { useFriendList } from "../../../custom-hooks/useFriendList";
import { useFriendRequestList } from "../../../custom-hooks/useFriendRequestList";

export function Friends({ ownData }) {
  const [isAddFriendModalVisible, setIsAddFriendModalVisible] = useState(false);
  const [currentNav, setCurrentNav] = useState("all");

  const { friendDataList } = useFriendList(ownData);
  const { friendRequestSentList, friendRequestReceivedList } = useFriendRequestList(ownData);

  const friendsButtonOnClick = (navType) => {
    setCurrentNav(navType);
  }

  return (
    <div id="cyber-friends">

      <div id="cyber-friends-nav">
        <h1>Friends</h1>
        <div className="divider"></div>
        <button 
          className={currentNav === "all" ? "selected" : ""}
          onClick={() => friendsButtonOnClick("all")}
        >
          All
        </button>
        <button
          className={currentNav === "pending" ? "selected" : ""}
          onClick={() => friendsButtonOnClick("pending")}
        >
          Pending
        </button>
        <button
          className={currentNav === "inbox" ? "selected" : ""}
          onClick={() => friendsButtonOnClick("inbox")}
        >
          Inbox
        </button>
        <button
          id="add-friend"
          onClick={() => setIsAddFriendModalVisible(true)}
        >
          Add Friend
        </button>
      </div>

      <div id="cyber-friends-content">
        <div id="friends-search">
          <div>
            <SearchSVG />
          </div>
          <input type="text" />
        </div>
        {
          currentNav === "all" ? 
            <FriendsAll friendDataList={friendDataList} />
          : currentNav === "pending" ?
            <FriendsPending
              friendRequestSentList={friendRequestSentList}
              friendRequestReceivedList={friendRequestReceivedList}
            />
          : null
        }
      </div>
      {
        isAddFriendModalVisible &&
        <AddFriendModal
          ownUid={ownData.uid}
          setIsAddFriendModalVisible={setIsAddFriendModalVisible} 
          friendRequestSentList={friendRequestSentList}
          friendRequestReceivedList={friendRequestReceivedList}
        />
      }
    </div>
  )
}