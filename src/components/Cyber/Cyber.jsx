import { Link, useParams } from "react-router-dom";
import { MenuSVG } from "../svg/nav-svg/MenuSVG";
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
import { onDisconnect, ref, set, update } from "firebase/database";

export function Cyber() {
  const { parameter } = useParams();
  const [ isAsideVisible, setIsAsideVisible ] = useState(true);

  const [isAuthChanged, setIsAuthChanged] = useState(false);
  const [ownData, setOwnData] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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

    const fetchOwnData = async () => {
      const ownDocRef = doc(db, "users", auth.currentUser.uid);

      unsubscribe = onSnapshot(ownDocRef, (snapshot) => {
        const data = snapshot.data();
        setOwnData(data);
      });
    }

    fetchOwnData();

    return () => {
      if (unsubscribe) unsubscribe();
    }
  }, [isAuthChanged]);

  return (
    <div id="cyber-page">
      <div id="cyber-container">
        <nav>
          <div id="toggle-chats-aside">
            {
              parameter === "chats" ?
                <button onClick={() => setIsAsideVisible((prev) => !prev)}>
                  <MenuSVG />
                </button>
              : null
            }
          </div>
          
          
          <div id="top-nav">
            <Link to="/cyber/chats">
              <ChatsSVG currentParameter={parameter} />
            </Link>
            <Link to="/cyber/friends">
              <FriendsSVG currentParameter={parameter} />
            </Link>
            <Link to="/cyber/settings">
              <SettingsSVG currentParameter={parameter} />
            </Link>
          </div>

          <div id="bottom-nav">
            <Link to="/cyber/account">
              <img id="nav-pfp" className={parameter === "account" ? "selected" : null} src="/empty-pfp.webp" />
            </Link>
            <button id="toggle-theme">
              <ThemeSVG theme="dark" />
            </button>
          </div>
        </nav>

        {
          parameter === "chats" ? <Chats ownData={ownData} isAsideVisible={isAsideVisible} />
          : parameter === "friends" ? <Friends ownData={ownData} />
          : parameter === "settings" ? <Settings ownData={ownData} />
          : parameter === "account" ? <Account ownData={ownData} />
          : null
        }
      </div>
    </div>
  )
}