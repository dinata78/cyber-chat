import { Link, useNavigate, useParams } from "react-router-dom";
import { Chats } from "./Chats/Chats";
import { Friends } from "./Friends/Friends";
import { Account } from "./Account/Account";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, realtimeDb } from "../../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useFriendList } from "../../custom-hooks/useFriendList";
import { useRequests } from "../../custom-hooks/useRequests";
import { useInbox } from "../../custom-hooks/useInbox";
import { useChats } from "../../custom-hooks/useChats";
import { useStatus } from "../../custom-hooks/useStatus";
import { get, onDisconnect, ref, update } from "firebase/database";
import { useUserData } from "../../custom-hooks/useUserData";
import { ChatsNavSVG, FriendsNavSVG, ThemeNavSVG  } from "../svg";

export function Cyber() {
  const { parameter } = useParams();

  const [isAuthChanged, setIsAuthChanged] = useState(false);
  const [ownData, setOwnData] = useState({});
  const [selectedChatUid, setSelectedChatUid] = useState("globalChat");
  const [isAccountVisible, setIsAccountVisible] = useState(false);

  const [ chatsHasNotif, setChatsHasNotif ] = useState(false);
  const [ pendingNotifCount, setPendingNotifCount ] = useState(0); 
  const [ inboxNotifCount, setInboxNotifCount ] = useState(0); 

  const [ devData ] = useUserData(import.meta.env.VITE_DEV_UID);
  const { friendUids, friendDatas } = useFriendList(ownData.uid);
  const { statusMap } = useStatus(ownData.uid, friendUids);
  const { requests } = useRequests(ownData.uid);
  const { inboxItems } = useInbox(ownData.uid);

  const { chatMessagesMap, chatUsernamesMap, messagesAmountMap, setMessagesAmountMap } = useChats(ownData.uid, friendUids);

  const navigate = useNavigate();

  useEffect(() => {
    if (!parameter) {
      navigate("/cyber/chats");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!auth?.currentUser) return;
      
      setIsAuthChanged(prev => !prev);

      const setOnlineStatus = async () => {
        const ownStatusRef = ref(realtimeDb, `users/${user.uid}`);
      
        const currentStatus = await get(ownStatusRef);
        
        if (currentStatus.val()?.status !== "hidden") {
          await update(ownStatusRef, { status: "online" });
      
          onDisconnect(ownStatusRef).update({ status: "offline" });
        }
        else {
          onDisconnect(ownStatusRef).cancel();
        }
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

  useEffect(() => {
    const chatMessagesList = Object.values(chatMessagesMap);

    let hasUnread = false;

    mainLoop:
    for (let i = 0; i < chatMessagesList.length; i++) {
      const chatMessages = chatMessagesList[i];

      for (const message of chatMessages) {
        if (message.isUnread && message.senderId !== ownData.uid) {
          hasUnread = true;
          break mainLoop;
        }
      }
      
      hasUnread = false;
    }

    if (hasUnread) setChatsHasNotif(true);
    else setChatsHasNotif(false);

  }, [chatMessagesMap]);

  return (
    <div id="cyber-page">
      <div id="cyber-container">
        <nav>
          <div id="top-nav">
            <Link to="/cyber/chats" tabIndex={-1}>
              <button className={parameter === "chats" ? "nav-button selected" : "nav-button"}>
                <ChatsNavSVG />
                {chatsHasNotif && <div id="cyber-notif"></div>}
              </button>
            </Link>
            <Link to="/cyber/friends" tabIndex={-1}>
              <button className={parameter === "friends" ? "nav-button selected" : "nav-button"}>
                <FriendsNavSVG />
                {pendingNotifCount + inboxNotifCount > 0 && <div id="cyber-notif"></div>}
              </button>
            </Link>
          </div>

          <div id="bottom-nav">
            <button 
              id="nav-pfp"
              onClick={() => setIsAccountVisible(true)}
            >
              <img src={ownData.pfpUrl || "/empty-pfp.webp"} />
            </button>
            <button id="toggle-theme">
              <ThemeNavSVG theme="dark" />
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
              friendDatas={friendDatas}
              devData={devData}
              chatMessagesMap={chatMessagesMap}
              chatUsernamesMap={chatUsernamesMap}
              messagesAmountMap={messagesAmountMap}
              setMessagesAmountMap={setMessagesAmountMap}
              statusMap={statusMap}
            />
          : parameter === "friends" ? 
            <Friends
              ownData={ownData}
              setSelectedChatUid={setSelectedChatUid}
              friendUids={friendUids}
              friendDatas={friendDatas}
              statusMap={statusMap}
              requests={requests}
              inboxItems={inboxItems}
              pendingNotifCount={pendingNotifCount}
              inboxNotifCount={inboxNotifCount}
            />
          : null
        }
      </div>
    </div>
  )
}