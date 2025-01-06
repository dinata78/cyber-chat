import { Link, useParams } from "react-router-dom";
import { ChatSVG } from "../svg/ChatSVG";
import { HomeSVG } from "../svg/HomeSVG";
import { SettingSVG } from "../svg/SettingSVG";
import { ThemeSVG } from "../svg/ThemeSVG";
import { Home } from "./Home";
import { Chats } from "./Chats/Chats";
import { Settings } from "./Settings/Settings";
import { Account } from "./Account";

export function Cyber() {
  const { parameter } = useParams();

  return (
    <div id="cyber-page">
      <div id="cyber-container">
        <nav>
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
              <img id="nav-pfp" className={parameter === "account" ? "nav-selected" : ""} src="/empty-pfp.webp" alt="PFP" />          
            </Link>
            <ThemeSVG theme="dark" />
          </div>
        </nav>

        {
          parameter === "home" ? <Home />
          : parameter === "chats" ? <Chats />
          : parameter === "settings" ? <Settings />
          : parameter === "account" ? <Account />
          : null
        }
      </div>
    </div>
  )
}