import { Link, useParams } from "react-router-dom";
import { ChatSVG } from "../svg/ChatSVG";
import { HomeSVG } from "../svg/HomeSVG";
import { SettingSVG } from "../svg/SettingSVG";
import { ThemeSVG } from "../svg/ThemeSVG";
import { Home } from "./Home";
import { Chats } from "./Chats";
import { Settings } from "./Settings";
import { Account } from "./Account";

export function Cyber() {
  const { parameter } = useParams();

  return (
    <div id="cyber-page">
      <div id="cyber-container">
        <nav>
          <Link to="/cyber/home">
            <HomeSVG className="nav-button" />          
          </Link>
          <Link to="/cyber/chats">
            <ChatSVG className="nav-button" />          
          </Link>
          <Link to="/cyber/settings">
            <SettingSVG className="nav-button" />
          </Link>
          <Link id="profile-picture" to="/cyber/account">
            <img src="/empty-pfp.webp" alt="PFP" />          
          </Link>
          <ThemeSVG theme="light" className="nav-button" />
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