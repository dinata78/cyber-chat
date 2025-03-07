import { useEffect, useState } from "react"
import { SearchSVG } from "../../svg/SearchSVG";
import { FriendsAll } from "./FriendsAll";
import { AddFriendModal } from "./AddFriendModal";
import { FriendsPending } from "./FriendsPending";
import { useFriendList } from "../../../custom-hooks/useFriendList";
import { useFriendRequest } from "../../../custom-hooks/useFriendRequestList";
import { FriendsInbox } from "./FriendsInbox";
import { useInbox } from "../../../custom-hooks/useInbox"
import { FriendsNotifUI } from "./FriendsNotifUI";

export function Friends({ ownData, setSelectedChatUid, setFriendsHasNotif }) {
  const [isAddFriendModalVisible, setIsAddFriendModalVisible] = useState(false);
  const [currentNav, setCurrentNav] = useState("all");

  const [ pendingNotifCount, setPendingNotifCount ] = useState(0); 
  const [ inboxNotifCount, setInboxNotifCount ] = useState(0); 

  const { friendUidList, friendDataList } = useFriendList(ownData.uid);
  const { friendRequest } = useFriendRequest(ownData.uid);
  const { inboxItems } = useInbox(ownData.uid);

  const friendsButtonOnClick = (navType) => {
    setCurrentNav(navType);
  }

  useEffect(() => {
    if (friendRequest.length) {
      const unreadFriendRequest = friendRequest.filter((request) => request.isUnread);
      setPendingNotifCount(unreadFriendRequest.length);
    }
    else {
      setPendingNotifCount(0);
    }
  }, [friendRequest]);

  useEffect(() => {
    if (inboxItems.length) {
      const unreadInboxItems = inboxItems.filter((item) => item.isUnread);
      setInboxNotifCount(unreadInboxItems.length);
    }
    else {
      setInboxNotifCount(0);
    }
  }, [inboxItems]);

  useEffect(() => {
    if (pendingNotifCount || inboxNotifCount) {
      setFriendsHasNotif(true);
    }
    else {
      setFriendsHasNotif(false);
    }
  }, [pendingNotifCount, inboxNotifCount]);

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
              friendDataList={friendDataList}
              setSelectedChatUid={setSelectedChatUid}
            />
          : currentNav === "pending" ?
            <FriendsPending
              ownData={ownData}
              friendRequest={friendRequest}
            />
          : currentNav === "inbox" ?
            <FriendsInbox
              ownData={ownData}
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
          friendRequest={friendRequest}
        />
      }
    </div>
  )
}