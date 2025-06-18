import { useEffect, useRef, useState } from "react";
import { useOwnData } from "../../custom-hooks/useOwnData";
import { useSetOwnStatus } from "../../custom-hooks/useSetOwnStatus";
import { ChatsNavSVG, CloseSVG, FriendsNavSVG, MenuSVG, SettingSVG, ThemeSVG } from "../svg";
import { getConversationId, getIndicatorClass, loadImagesAndScrollTo } from "../../utils";
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

export function Chat() {
  const [ isSidebarVisible, setIsSidebarVisible ] = useState(false);
  const [ isSettingsVisible, setIsSettingsVisible ] = useState(false);
  const [ currentNav, setCurrentNav ] = useState("chats");
  const [ theme, setTheme ] = useState("light");

  const [ selectedChatUid, setSelectedChatUid ] = useState(null);

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

  const navigate = useNavigate();

  const isFirstRender = useRef(true);
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

  useSetOwnStatus(ownData?.uid);

  useHandleLastMessageModified(messagesRef, selectedChatMessages, ownData.uid);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

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
            className="toggle-sidebar"
            onClick={() => setIsSidebarVisible(prev => !prev)}
          >
            {isSidebarVisible ? <CloseSVG /> : <MenuSVG />}
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

        </div>
      </div>

      <div className="bottom">
        <aside
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
          setIsSidebarVisible={setIsSidebarVisible}
          selectedChatUid={selectedChatUid}
          messagesRef={messagesRef}
          messageInputRef={messageInputRef}
          selectedChatMessages={selectedChatMessages}
          selectedChatMessagesAmount={selectedChatMessagesAmount}
          addSelectedChatMessagesAmount={addSelectedChatMessagesAmount}
          chatDisplayNameMap={chatDisplayNameMap}
          chatPfpUrlMap={chatPfpUrlMap}
        />
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