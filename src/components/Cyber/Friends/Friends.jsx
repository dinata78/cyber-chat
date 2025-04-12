import { useEffect, useRef, useState } from "react"
import { SearchSVG } from "../../svg/SearchSVG";
import { FriendsAll } from "./friends-all/FriendsAll";
import { AddFriendModal } from "./add-friend-modal/AddFriendModal";
import { FriendsPending } from "./friends-pending/FriendsPending";
import { FriendsInbox } from "./friends-inbox/FriendsInbox";
import { FriendsNotifUI } from "./FriendsNotifUI";
import { collection, getDocs, query, where, writeBatch } from "firebase/firestore";
import { db } from "../../../../firebase";

export function Friends({ ownData, setSelectedChatUid, friendUids, friendDatas, statusMap, requests, inboxItems, pendingNotifCount, inboxNotifCount }) {
  const [isAddFriendModalVisible, setIsAddFriendModalVisible] = useState(false);
  const [currentNav, setCurrentNav] = useState("all");
  const [searchedInput, setSearchedInput] = useState("");

  const prevNav = useRef("");
  const inputRef = useRef(null);

  const friendsButtonOnClick = (navType) => {
    setCurrentNav(navType);
  }

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        inputRef.current.focus();
      }
    }

    document.addEventListener("keydown", handleKeydown);

    return () => document.removeEventListener("keydown", handleKeydown)
  }, []);

  useEffect(() => {
    if (!ownData.uid) return;
    if (!prevNav.current || prevNav.current === "all") return;

    const clearUnread = async () => {
      const unreadQuery = query(
        collection(
          db, "users", ownData.uid,
          prevNav.current === "pending" ?
            "requests"
          : "inbox"
        ),
        where("isUnread", "==", true)
      );

      const unreadDocs = await getDocs(unreadQuery);

      if (unreadDocs.docs.length) {
        const batch = writeBatch(db);

        unreadDocs.docs.forEach(doc => {
          batch.update(doc.ref, {
            ...doc.data(),
            isUnread: false
          });
        });

        await batch.commit();
      }
    }

    clearUnread();

  }, [currentNav]);

  useEffect(() => {
    prevNav.current = currentNav;
  }, [currentNav]);

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
            currentNav !== "pending" &&
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
            currentNav !== "inbox" &&
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
          <input
            ref={inputRef}
            type="text"
            onChange={(e) => setSearchedInput(e.target.value)}
          />
        </div>
        {
          currentNav === "all" ? 
            <FriendsAll
              ownUid={ownData.uid}
              friendDatas={friendDatas}
              statusMap={statusMap}
              setSelectedChatUid={setSelectedChatUid}
              searchedInput={searchedInput}
            />
          : currentNav === "pending" ?
            <FriendsPending
              ownUid={ownData.uid}
              requests={requests}
              searchedInput={searchedInput}
            />
          : currentNav === "inbox" ?
            <FriendsInbox
              ownUid={ownData.uid}
              inboxItems={inboxItems}
              searchedInput={searchedInput}
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