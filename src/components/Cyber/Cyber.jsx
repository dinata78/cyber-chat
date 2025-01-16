import { Link, useParams } from "react-router-dom";
import { MenuSVG } from "../svg/nav-svg/MenuSVG";
import { ChatsSVG } from "../svg/nav-svg/ChatsSVG";
import { SettingsSVG } from "../svg/nav-svg/SettingsSVG";
import { FriendsSVG } from "../svg/nav-svg/FriendsSVG";
import { ThemeSVG } from "../svg/nav-svg/ThemeSVG";
import { Chats } from "./Chats/Chats";
import { Friends } from "./Contacts/Friends";
import { Settings } from "./Settings/Settings";
import { Account } from "./Account/Account";
import { useState } from "react";

export function Cyber() {
  const { parameter } = useParams();
  const [ isAsideVisible, setIsAsideVisible ] = useState(true);

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
              <img id="nav-pfp" className={parameter === "account" ? "selected" : ""} src="/empty-pfp.webp" alt="PFP" />          
            </Link>
            <button id="toggle-theme" >
              <ThemeSVG theme="dark" />
            </button>
          </div>
        </nav>

        {
          parameter === "chats" ? <Chats isAsideVisible={isAsideVisible} />
          : parameter === "friends" ? <Friends />
          : parameter === "settings" ? <Settings />
          : parameter === "account" ? <Account />
          : null
        }
      </div>
    </div>
  )
}