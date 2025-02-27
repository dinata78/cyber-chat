import { useState } from "react"
import { SearchSVG } from "../../svg/SearchSVG";
import { FriendsAll } from "./FriendsAll";
import { AddFriendModal } from "./AddFriendModal";
import { FriendsPending } from "./FriendsPending";
import { useFriendList } from "../../../custom-hooks/useFriendList";
import { useFriendRequestList } from "../../../custom-hooks/useFriendRequestList";
import { FriendsInbox } from "./FriendsInbox";
import { useInbox } from "../../../custom-hooks/useInbox"

export function Friends({ ownData, setSelectedChatUid }) {
  const [isAddFriendModalVisible, setIsAddFriendModalVisible] = useState(false);
  const [currentNav, setCurrentNav] = useState("all");

  const { friendUidList, friendDataList } = useFriendList(ownData);
  const { friendRequestSentList, friendRequestReceivedList } = useFriendRequestList(ownData);
  const { inboxItems } = useInbox(ownData.uid);

  const friendsButtonOnClick = (navType) => {
    setCurrentNav(navType);
  }

  return (
    <div id="cyber-friends">

      <div id="cyber-friends-nav">
        <h1>Friends</h1>
        <div className="divider"></div>
        <button 
          className={currentNav === "all" ? "selected" : null}
          onClick={() => friendsButtonOnClick("all")}
        >
          All
        </button>
        <button
          className={currentNav === "pending" ? "selected" : null}
          onClick={() => friendsButtonOnClick("pending")}
        >
          Pending
        </button>
        <button
          className={currentNav === "inbox" ? "selected" : null}
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
            <FriendsAll
              ownUid={ownData.uid}
              friendDataList={friendDataList}
              setSelectedChatUid={setSelectedChatUid}
            />
          : currentNav === "pending" ?
            <FriendsPending
              ownUid={ownData.uid}
              friendRequestSentList={friendRequestSentList}
              friendRequestReceivedList={friendRequestReceivedList}
            />
          : currentNav === "inbox" ?
            <FriendsInbox
              ownUid={ownData.uid}
              inboxItems={inboxItems}
            />
          : null
        }
      </div>
      {
        isAddFriendModalVisible &&
        <AddFriendModal
          ownUid={ownData.uid}
          setIsAddFriendModalVisible={setIsAddFriendModalVisible}
          friendList={friendUidList}
          friendRequestSentList={friendRequestSentList}
          friendRequestReceivedList={friendRequestReceivedList}
        />
      }
    </div>
  )
}