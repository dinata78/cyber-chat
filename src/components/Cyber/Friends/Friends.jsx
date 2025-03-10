import { useEffect, useState } from "react"
import { SearchSVG } from "../../svg/SearchSVG";
import { FriendsAll } from "./FriendsAll";
import { AddFriendModal } from "./AddFriendModal";
import { FriendsPending } from "./FriendsPending";
import { useFriendList } from "../../../custom-hooks/useFriendList";
import { FriendsInbox } from "./FriendsInbox";
import { useInbox } from "../../../custom-hooks/useInbox"
import { FriendsNotifUI } from "./FriendsNotifUI";
import { useRequests } from "../../../custom-hooks/useRequests";

export function Friends({ ownData, setSelectedChatUid, setFriendsHasNotif }) {
  const [isAddFriendModalVisible, setIsAddFriendModalVisible] = useState(false);
  const [currentNav, setCurrentNav] = useState("all");

  const [ pendingNotifCount, setPendingNotifCount ] = useState(0); 
  const [ inboxNotifCount, setInboxNotifCount ] = useState(0); 

  const { friendListUids, friendListDatas } = useFriendList(ownData.uid);
  const { requests } = useRequests(ownData.uid);
  const { inboxItems } = useInbox(ownData.uid);

  const friendsButtonOnClick = (navType) => {
    setCurrentNav(navType);
  }

  useEffect(() => {
    if (requests.length) {
      const unreadRequests = requests.filter((request) => request.isUnread);
      setPendingNotifCount(unreadRequests.length);
    }
    else {
      setPendingNotifCount(0);
    }
  }, [requests]);

  useEffect(() => {
    if (inboxItems.length) {
      const unreadInboxItems = inboxItems.filter(item => item.isUnread);
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
              friendListDatas={friendListDatas}
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
          friendListUids={friendListUids}
          requests={requests}
        />
      }
    </div>
  )
}