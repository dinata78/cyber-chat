import { Link, useParams } from "react-router-dom";
import { ChatsSVG } from "../svg/nav-svg/ChatsSVG";
import { SettingsSVG } from "../svg/nav-svg/SettingsSVG";
import { FriendsSVG } from "../svg/nav-svg/FriendsSVG";
import { ThemeSVG } from "../svg/nav-svg/ThemeSVG";
import { Chats } from "./Chats/Chats";
import { Friends } from "./Friends/Friends";
import { Settings } from "./Settings/Settings";
import { Account } from "./Account/Account";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, realtimeDb } from "../../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { onDisconnect, ref, update } from "firebase/database";
import { useFriendList } from "../../custom-hooks/useFriendList";
import { useRequests } from "../../custom-hooks/useRequests";
import { useInbox } from "../../custom-hooks/useInbox";
import { useChats } from "../../custom-hooks/useChats";

export function Cyber() {
  const { parameter } = useParams();

  const [isAuthChanged, setIsAuthChanged] = useState(false);
  const [ownData, setOwnData] = useState({});
  const [selectedChatUid, setSelectedChatUid] = useState("globalChat");
  const [isAccountVisible, setIsAccountVisible] = useState(false);
  const [ pendingNotifCount, setPendingNotifCount ] = useState(0); 
  const [ inboxNotifCount, setInboxNotifCount ] = useState(0); 

  const { friendListUids, friendListDatas } = useFriendList(ownData.uid);
  const { requests } = useRequests(ownData.uid);
  const { inboxItems } = useInbox(ownData.uid);

  const { chatMessagesMap, chatUsernamesMap } = useChats(ownData.uid, friendListUids);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!auth.currentUser) return;
      
      setIsAuthChanged((prev) => !prev);

      const setOnlineStatus = async () => {
        const dbRef = ref(realtimeDb, `users/${user.uid}`);

        await update(dbRef, {isOnline: true});
        onDisconnect(dbRef).update({isOnline: false});
      }

      setOnlineStatus();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!auth?.currentUser) return;

    let unsubscribe = null;

    const fetchAndSetOwnData = async () => {
      const ownDocRef = doc(db, "users", auth.currentUser.uid);

      unsubscribe = onSnapshot(ownDocRef, (snapshot) => {
        const data = snapshot.data();
        setOwnData(data);
      });
    }

    fetchAndSetOwnData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    }
  }, [isAuthChanged]);

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

  return (
    <div id="cyber-page">
      <div id="cyber-container">
        <nav>
          <div id="top-nav">
            <Link to="/cyber/chats" tabIndex={-1}>
              <button className={parameter === "chats" ? "nav-button selected" : "nav-button"}>
                <ChatsSVG />
                {true && <div id="cyber-notif"></div>}
              </button>
            </Link>
            <Link to="/cyber/friends" tabIndex={-1}>
              <button className={parameter === "friends" ? "nav-button selected" : "nav-button"}>
                <FriendsSVG />
                {pendingNotifCount + inboxNotifCount > 0 && <div id="cyber-notif"></div>}
              </button>
            </Link>
            <Link to="/cyber/settings" tabIndex={-1}>
              <button className={parameter === "settings" ? "nav-button selected" : "nav-button"}>
                <SettingsSVG />
              </button>
            </Link>
          </div>

          <div id="bottom-nav">
            <button 
              id="nav-pfp"
              onClick={() => setIsAccountVisible(true)}
            >
              <img src="/empty-pfp.webp" />
            </button>
            <button id="toggle-theme">
              <ThemeSVG theme="dark" />
            </button>
          </div>
        </nav>

        {
          isAccountVisible && 
            <Account
              ownData={ownData}
              setIsAccountVisible={setIsAccountVisible}
            />
        }

        {
          parameter === "chats" ? 
            <Chats
              ownData={ownData}
              selectedChatUid={selectedChatUid}
              setSelectedChatUid={setSelectedChatUid}
              friendListDatas={friendListDatas}
              chatMessagesMap={chatMessagesMap}
              chatUsernamesMap={chatUsernamesMap}
            />
          : parameter === "friends" ? 
            <Friends
              ownData={ownData}
              setSelectedChatUid={setSelectedChatUid}
              friendListUids={friendListUids}
              friendListDatas={friendListDatas}
              requests={requests}
              inboxItems={inboxItems}
              pendingNotifCount={pendingNotifCount}
              inboxNotifCount={inboxNotifCount}
            />
          : parameter === "settings" ?
            <Settings
              ownData={ownData}
            />
          : null
        }
      </div>
    </div>
  )
}