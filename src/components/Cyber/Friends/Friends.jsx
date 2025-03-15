import { useState } from "react"
import { SearchSVG } from "../../svg/SearchSVG";
import { FriendsAll } from "./friends-all/FriendsAll";
import { AddFriendModal } from "./add-friend-modal/AddFriendModal";
import { FriendsPending } from "./friends-pending/FriendsPending";
import { FriendsInbox } from "./friends-inbox/FriendsInbox";
import { FriendsNotifUI } from "./FriendsNotifUI";

export function Friends({ ownData, setSelectedChatUid, friendUids, friendDatas, statusMap, requests, inboxItems, pendingNotifCount, inboxNotifCount }) {
  const [isAddFriendModalVisible, setIsAddFriendModalVisible] = useState(false);
  const [currentNav, setCurrentNav] = useState("all");

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
          {
            pendingNotifCount > 0 &&
            <FriendsNotifUI count={pendingNotifCount} />
          }
        </button>

        <button
          className={currentNav === "inbox" ? "selected" : null}
          onClick={() => friendsButtonOnClick("inbox")}
        >
          Inbox
          {
            inboxNotifCount > 0 &&
            <FriendsNotifUI count={inboxNotifCount} />
          }
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
              friendDatas={friendDatas}
              statusMap={statusMap}
              setSelectedChatUid={setSelectedChatUid}
            />
          : currentNav === "pending" ?
            <FriendsPending
              ownUid={ownData.uid}
              requests={requests}
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
          friendUids={friendUids}
          requests={requests}
        />
      }
    </div>
  )
}