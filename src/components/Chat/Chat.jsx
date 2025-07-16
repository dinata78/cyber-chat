import { createContext, useEffect, useRef, useState } from "react";
import { useOwnData } from "../../custom-hooks/useOwnData";
import { useSetOwnStatus } from "../../custom-hooks/useSetOwnStatus";
import { AccountArrowDownSVG, ChatsNavSVG, CloseSVG, FriendsNavSVG, InboxSVG, MenuSVG, SettingSVG, ThemeSVG } from "../svg";
import { getConversationId, getIndicatorClass } from "../../utils";
import { Settings } from "./Settings/Settings";
import { useIsAuth } from "../../custom-hooks/useIsAuth";
import { get, ref, update } from "firebase/database";
import { db, realtimeDb } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { useStatusByUid } from "../../custom-hooks/useStatusByUid";
import { Chats } from "./Chats/Chats";
import { useUserData } from "../../custom-hooks/useUserData"
import { useDM } from "../../custom-hooks/useDM" 
import { useFriendList } from "../../custom-hooks/useFriendList";
import { Friends } from "./Friends/Friends";
import { useChat } from "../../custom-hooks/useChat";
import { useStatus } from "../../custom-hooks/useStatus";
import { Message } from "./Message/Message";
import { useHandleLastMessageModified } from "../../custom-hooks/useHandleLastMessageModified";
import { useUnreadCount } from "../../custom-hooks/useUnreadCount";
import { useClearUnreadCount } from "../../custom-hooks/useClearUnreadCount";
import { ChatDialog } from "./ChatDialog/ChatDialog";
import { previewAccount } from "../AccountPreview";
import { addDoc, collection } from "firebase/firestore";
import { addModalToStack, getTopModalFromStack, removeModalFromStack } from "../modalStack";

export const DMContext = createContext(null);

let openSettingsGlobal; 
let chatFriendGlobal;

export function openSettings() {
  openSettingsGlobal?.();
}

export async function chatFriend(ownUid, uid, DMIds, isDMIdsLoading) {
  await chatFriendGlobal?.(ownUid, uid, DMIds, isDMIdsLoading);
}

export function Chat() {
  const [ currentNav, setCurrentNav ] = useState("chats");
  const [ currentDialogNav, setCurrentDialogNav ] = useState(null);
  const [ isSidebarVisible, setIsSidebarVisible ] = useState(false);
  const [ isSettingsVisible, setIsSettingsVisible ] = useState(false);
  const [ theme, setTheme ] = useState("light");  

  const [ selectedChatUid, setSelectedChatUid ] = useState(null);

  const [ selectedChatUnreadCount, setSelectedChatUnreadCount ] = useState(0);

  const { isAuth } = useIsAuth();
  const { ownData } = useOwnData();
  const [ ownStatus ] = useStatusByUid(ownData.uid);
  const [ devData ] = useUserData(import.meta.env.VITE_DEV_UID);
  const { DMIds, DMDatas, isDMIdsLoading, isDMDatasLoading } = useDM(ownData.uid);
  const { friendUids, friendDatas } = useFriendList(ownData.uid);

  const { statusMap } = useStatus(friendUids);

  const {
    chatMessagesMap,
    chatDataMap,
    messagesAmountMap,
    setMessagesAmountMap
  } = useChat(ownData.uid, DMIds);

  const { unreadCountMap } = useUnreadCount(ownData.uid, DMIds, devData?.uid);

  const navigate = useNavigate();

  const isFirstRender = useRef(true);

  const sidebarRef = useRef(null);

  const requestsButtonRef = useRef(null);
  const inboxButtonRef = useRef(null);
  
  const messagesRef = useRef(null);
  const messageInputRef = useRef(null);

  const conversationId = getConversationId(ownData.uid, selectedChatUid);
  const selectedChatMessages = chatMessagesMap[conversationId] || [];
  const selectedChatMessagesAmount = messagesAmountMap[conversationId] || messagesAmountMap["default"];

  const previewOwnAccount = () => {
    previewAccount({
      uid: ownData.uid,
      pfpUrl: ownData.pfpUrl,
      displayName: ownData.displayName,
      username: ownData.displayName,
      bio: ownData.bio,
    });
  }

  const addSelectedChatMessagesAmount = (amount) => {
    setMessagesAmountMap(prev => {
      const map = {...prev};
      map[conversationId] = selectedChatMessagesAmount + amount;
      return map;
    });
  }

  const messageFriend = async (ownUid, uid, DMIds, isDMIdsLoading) => {
    if (!ownUid || !uid || isDMIdsLoading) return;

    const conversationId = getConversationId(ownUid, uid);
    const isInDM = DMIds?.includes(conversationId);

    if (!isInDM) {
      const activeDMRef = collection(db, "users", ownUid, "activeDM");
      await addDoc(activeDMRef, { conversationId: conversationId });
    }
    setSelectedChatUid(uid);
    setIsSidebarVisible(false);
  }

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  useEffect(() => {
    openSettingsGlobal = () => setIsSettingsVisible(true);
    chatFriendGlobal = messageFriend;
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        if (getTopModalFromStack() === "sidebar") {
          setIsSidebarVisible(false);
          removeModalFromStack("sidebar");
        }
      }
    }

    if (isSidebarVisible) {
      addModalToStack("sidebar");
      document.addEventListener("keydown", handleEscape);
    }
    else {
      removeModalFromStack("sidebar");
      document.removeEventListener("keydown", handleEscape);
    }

    return () => {
      removeModalFromStack("sidebar");
      document.removeEventListener("keydown", handleEscape);
    }
  }, [isSidebarVisible]);

  useEffect(() => {
    const unreadCount = unreadCountMap[conversationId];

    setSelectedChatUnreadCount(unreadCount);
  }, [conversationId]);

  useSetOwnStatus(ownData.uid);

  useClearUnreadCount(ownData.uid, conversationId);

  useHandleLastMessageModified(messagesRef, selectedChatMessages, ownData.uid);

  useEffect(() => {
    if (!isAuth && !isFirstRender.current && ownData.uid) {
      const logOut = async() => {
        try {
          const statusRef = ref(realtimeDb, `users/${ownData.uid}`);
          const currentStatus = await get(statusRef);

          if (currentStatus.val()?.status !== "hidden") {
            await update(statusRef, { status: "offline" });
          }
        }
        catch (error) {
          console.error(error);
        }
        finally {
          navigate("/");
        }
      }

      logOut();
    }
  }, [isAuth]);

  return (
    <div id="chat-page">

      <div className="top">
        <div id="chat-logo">
          <img src="./cyberchat-logo.webp" alt="CyberChat Logo" />
        </div>

        <div id="chat-header" onClick={() => setIsSidebarVisible(false)}>

          <button
            className="toggle-sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentDialogNav(null);
              setIsSidebarVisible(prev => !prev);
            }}
          >
            <div className="wrapper">
              {!isSidebarVisible ? <MenuSVG /> : <CloseSVG />}
            </div>
          </button>

          <div className="name">
            <span className="display-name text-overflow-support">
              {
                selectedChatUid === "globalChat" ? "Global Chat"
                : chatDataMap[selectedChatUid]?.displayName || "Loading..."
              }
            </span>
            <span className="username text-overflow-support">
              {
                chatDataMap[selectedChatUid]?.username &&
                `@${chatDataMap[selectedChatUid].username}`
              }
            </span>
          </div>

          <div className="v-line"></div>

          <button
            ref={requestsButtonRef}
            title="Friend Requests"
            className="dialog"
            style={{
              fill: currentDialogNav === "requests" && "white", 
              marginLeft: "0"
            }}
            onClick={() => setCurrentDialogNav("requests")}
          >
            <AccountArrowDownSVG />
          </button>

          <button
            ref={inboxButtonRef}
            title="Inbox"
            className="dialog"
            style={{
              fill: currentDialogNav === "inbox" && "white",
              marginRight: "12px"
            }}
            onClick={() => setCurrentDialogNav("inbox")}
          >
            <InboxSVG />
          </button>

        </div>
      </div>

      <div className="bottom">
        <aside
          ref={sidebarRef}
          id="chat-sidebar"
          className={isSidebarVisible ? "visible" : null}
        >

          <div className="top">
            <nav>
              <button
                className={currentNav === "chats" ? "selected" : null}
                onClick={() => setCurrentNav("chats")}
              >
                <ChatsNavSVG />
                Chats
              </button>
              <button
                className={currentNav === "friends" ? "selected" : null}
                onClick={() => setCurrentNav("friends")}
              >
                <FriendsNavSVG />
                Friends
              </button>
            </nav>

            {
              currentNav === "chats" ?
                <Chats
                  ownData={ownData}
                  ownStatus={ownStatus}
                  devData={devData}
                  DMDatas={DMDatas}
                  statusMap={statusMap}
                  unreadCountMap={unreadCountMap}
                  selectedChatUid={selectedChatUid}
                  setSelectedChatUid={setSelectedChatUid}
                  setIsSidebarVisible={setIsSidebarVisible}
                />
              : <DMContext.Provider value={{ DMIds, isDMIdsLoading }}>
                  <Friends
                    ownUid={ownData.uid}
                    friendDatas={friendDatas}
                    statusMap={statusMap}
                    messageFriend={messageFriend}
                  />
                </DMContext.Provider>
            }

          </div>

          <div className="bottom">

            <div
              tabIndex={0}
              className="account"
              onClick={previewOwnAccount}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  previewOwnAccount();
                }
              }}
            >
              <div className="pfp">
                <img src={ownData.pfpUrl || "/empty-pfp.webp"} />
                <div className={getIndicatorClass(ownStatus)}></div>
              </div>
              <div className="name">
                <span className="text-overflow-support">
                  {ownData.displayName || "Loading..."}
                </span>
                <span
                  className="text-overflow-support"
                  style={{color: "#ccccff", fontSize: "12px"}}
                >
                  {
                    ownData.username === "" ? "(Not Set)"
                    : ownData.username ? "@" + ownData.username: null
                  }
                </span>
              </div>
            </div>            

            <div className="buttons">
              <button 
                onClick={() => {
                  setTheme(prev => prev === "light" ? "dark" : "light");
                }}
              >
                <ThemeSVG theme={theme} />
              </button>
              <button onClick={() => setIsSettingsVisible(true)}>
                <SettingSVG />
              </button>
            </div>
            
          </div>

        </aside>
        
        <DMContext.Provider value={{ DMIds, isDMIdsLoading }}>
          <Message
            ownData={ownData}
            isSidebarVisible={isSidebarVisible}
            closeSidebar={() => setIsSidebarVisible(false)}
            selectedChatUid={selectedChatUid}
            messagesRef={messagesRef}
            messageInputRef={messageInputRef}
            selectedChatMessages={selectedChatMessages}
            selectedChatUnreadCount={selectedChatUnreadCount}
            clearSelectedChatUnreadCount={() => setSelectedChatUnreadCount(0)}
            selectedChatMessagesAmount={selectedChatMessagesAmount}
            addSelectedChatMessagesAmount={addSelectedChatMessagesAmount}
            chatDataMap={chatDataMap}
          />
        </DMContext.Provider>

        {
          currentDialogNav &&
          <ChatDialog
            currentDialogNav={currentDialogNav}
            closeDialog={() => setCurrentDialogNav(null)}
            requestsButtonRef={requestsButtonRef}
            inboxButtonRef={inboxButtonRef}
          />
        }

      </div>
        
      {
        isSettingsVisible && 
        <Settings
          ownData={ownData}
          ownStatus={ownStatus}
          closeSettings={() => setIsSettingsVisible(false)}
        />
      }

    </div>
  )
}