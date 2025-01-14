import { Link, useParams } from "react-router-dom";
import { ChatSVG } from "../svg/nav-svg/ChatSVG";
import { HomeSVG } from "../svg/nav-svg/HomeSVG";
import { SettingSVG } from "../svg/nav-svg/SettingSVG";
import { ThemeSVG } from "../svg/nav-svg/ThemeSVG";
import { Home } from "./Home";
import { Chats } from "./Chats/Chats";
import { Settings } from "./Settings/Settings";
import { Account } from "./Account";
import { useState } from "react";
import { MenuSVG } from "../svg/nav-svg/MenuSVG";

export function Cyber() {
  const { parameter } = useParams();
  const [ isAsideVisible, setIsAsideVisible ] = useState(true);

  return (
    <div id="cyber-page">
      <div id="cyber-container">
        <nav>
          {
            parameter === "chats" ?
              <button id="toggle-chats-aside" onClick={() => setIsAsideVisible((prev) => !prev)}>
                <MenuSVG />
              </button> 
            : null
          }
          
          <div id="top-nav">
            
            <Link to="/cyber/home">
              <HomeSVG currentParameter={parameter} />          
            </Link>
            <Link to="/cyber/chats">
              <ChatSVG currentParameter={parameter} />          
            </Link>
            <Link to="/cyber/settings">
              <SettingSVG currentParameter={parameter} />
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
          parameter === "home" ? <Home />
          : parameter === "chats" ? <Chats isAsideVisible={isAsideVisible} />
          : parameter === "settings" ? <Settings />
          : parameter === "account" ? <Account />
          : null
        }
      </div>
    </div>
  )
}