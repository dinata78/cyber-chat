import { useEffect, useRef, useState } from "react";
import { useOwnData } from "../../custom-hooks/useOwnData";
import { useSetOwnStatus } from "../../custom-hooks/useSetOwnStatus";
import { AccountArrowDownSVG, ChatsNavSVG, CloseSVG, FriendsNavSVG, InboxSVG, MenuSVG, SettingSVG, ThemeSVG } from "../svg";
import { getConversationId, getIndicatorClass } from "../../utils";
import { Settings } from "./Settings/Settings";
import { useIsAuth } from "../../custom-hooks/useIsAuth";
import { get, ref, update } from "firebase/database";
import { realtimeDb } from "../../../firebase";
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
  const [ ownStatus ] = useStatusByUid(ownData?.uid);
  const [ devData ] = useUserData(import.meta.env.VITE_DEV_UID);
  const { DMIds, DMDatas } = useDM(ownData?.uid);
  const { friendUids, friendDatas } = useFriendList(ownData?.uid);

  const { statusMap } = useStatus(friendUids);

  const {
    chatMessagesMap,
    chatDisplayNameMap,
    chatUsernameMap,
    chatPfpUrlMap,
    messagesAmountMap,
    setMessagesAmountMap
  } = useChat(ownData?.uid, DMIds);

  const { unreadCountMap } = useUnreadCount(ownData?.uid, DMIds, devData?.uid);

  const navigate = useNavigate();

  const isFirstRender = useRef(true);

  const toggleSidebarRef = useRef(null);
  const sidebarRef = useRef(null);

  const requestsButtonRef = useRef(null);
  const inboxButtonRef = useRef(null);
  
  const messagesRef = useRef(null);
  const messageInputRef = useRef(null);

  const conversationId = getConversationId(ownData.uid, selectedChatUid);
  const selectedChatMessages = chatMessagesMap[conversationId] || [];
  const selectedChatMessagesAmount = messagesAmountMap[conversationId] || messagesAmountMap["default"];

  const addSelectedChatMessagesAmount = (amount) => {
    setMessagesAmountMap(prev => {
      const map = {...prev};
      map[conversationId] = selectedChatMessagesAmount + amount;
      return map;
    });
  }

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        isSidebarVisible &&
        toggleSidebarRef.current &&
        sidebarRef.current &&
        !toggleSidebarRef.current.contains(e.target) &&
        !sidebarRef.current.contains(e.target)
      ) {
        setIsSidebarVisible(false);
      }
    }

    if (isSidebarVisible) {
      document.addEventListener("click", handleClick);      
    }
    else {
      document.removeEventListener("click", handleClick);
    }

    return () => document.removeEventListener("click", handleClick);
  }, [isSidebarVisible]);

  useEffect(() => {
    const unreadCount = unreadCountMap[conversationId];

    setSelectedChatUnreadCount(unreadCount);
  }, [conversationId]);

  useSetOwnStatus(ownData?.uid);

  useClearUnreadCount(ownData?.uid, conversationId);

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

        <div id="chat-header">

          <button
            ref={toggleSidebarRef}
            className="toggle-sidebar"
            onClick={() => setIsSidebarVisible(prev => !prev)}
          >
            <div className="wrapper">
              {!isSidebarVisible ? <MenuSVG /> : <CloseSVG />}
            </div>
          </button>

          <div className="name">
            <span className="display-name text-overflow-support">
              {
                selectedChatUid === "globalChat" ? "Global Chat"
                : chatDisplayNameMap[selectedChatUid] || "Loading..."
              }
            </span>
            <span className="username text-overflow-support">
              {
                chatUsernameMap[selectedChatUid] ?
                  `@${chatUsernameMap[selectedChatUid]}`
                : null
              }
            </span>
          </div>

          <div className="v-line"></div>

          <button
            ref={requestsButtonRef}
            title="Friend Requests"
            className="right"
            style={{
              fill: currentDialogNav === "requests" && "white" 
            }}
            onClick={() => setCurrentDialogNav("requests")}
          >
            <AccountArrowDownSVG />
          </button>

          <button
            ref={inboxButtonRef}
            title="Inbox"
            className="right"
            style={{
              marginLeft: "8px",
              marginRight: "12px",
              fill: currentDialogNav === "inbox" && "white"
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
              : <Friends
                  ownUid={ownData.uid}
                  friendDatas={friendDatas}
                  statusMap={statusMap}
                  setSelectedChatUid={setSelectedChatUid}
                  setIsSidebarVisible={setIsSidebarVisible}
                  DMIds={DMIds}
                />
            }

          </div>

          <div className="bottom">
            
            <div className="pfp">
              <img src={ownData.pfpUrl || "/empty-pfp.webp"} />
              <div className={getIndicatorClass(ownStatus)}></div>
            </div>

            <div className="side">
              <div className="name">
                <span className="display-name text-overflow-support">
                  {ownData.displayName || "Loading..."}
                </span>
                <span className="username text-overflow-support">
                  {
                    ownData.username === "" ? "(Not Set)"
                    : ownData.username ? "@" + ownData.username: null
                  }
                </span>
              </div>

              <div className="buttons">
                <button 
                  onClick={() => theme === "light" ? setTheme("dark") : setTheme("light")}
                >
                  <ThemeSVG theme={theme} />
                </button>
                <button onClick={() => setIsSettingsVisible(true)}>
                  <SettingSVG />
                </button>
              </div>
            </div>
            
          </div>

        </aside>
        
        <Message
          ownData={ownData}
          isSidebarVisible={isSidebarVisible}
          selectedChatUid={selectedChatUid}
          messagesRef={messagesRef}
          messageInputRef={messageInputRef}
          selectedChatMessages={selectedChatMessages}
          selectedChatUnreadCount={selectedChatUnreadCount}
          clearSelectedChatUnreadCount={() => setSelectedChatUnreadCount(0)}
          selectedChatMessagesAmount={selectedChatMessagesAmount}
          addSelectedChatMessagesAmount={addSelectedChatMessagesAmount}
          chatDisplayNameMap={chatDisplayNameMap}
          chatPfpUrlMap={chatPfpUrlMap}
        />

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
          setIsSettingsVisible={setIsSettingsVisible}
        />
      }

    </div>
  )
}