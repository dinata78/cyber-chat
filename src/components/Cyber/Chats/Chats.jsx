import { FriendCard } from "./FriendCard";
import { PlusIconSVG } from "../../svg/PlusIconSVG";
import { SearchIconSVG } from "../../svg/SearchIconSVG";
import { ArrowLeftIconSVG } from "../../svg/ArrowLeftIconSVG";

export function Chats() {
  return (
    <div id="cyber-chats-container">
      <div id="cyber-chats-main">
        <div id="chat-header">

          <div id="chat-header-top">
            <h1>Chats</h1>
            <button id="chat-add-button">
                <PlusIconSVG />
            </button>
          </div>
          
          <div id="chat-header-bottom">
            <div id="chat-search">
              <div id="chat-search-icon-container">
                <SearchIconSVG />
              </div>
              <input id="chat-search-input" type="text" placeholder="Search" />
            </div>
          </div>

        </div>
        <div id="friend-list">
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />

        </div>
      </div>

      <div id="cyber-chats-content">
        <div id="chats-content-top">
          <div id="current-chat-pfp-container">
            <img id="current-chat-pfp" src="/globe.webp" />
          </div>
          <div id="current-chat-info">
            <span id="current-chat-name">Global Chat</span>
            <span id="current-chat-title">A global room everyone can access.</span>
          </div>
        </div>

        <div id="chats-content-bottom">
          <div id="chat-display"></div>
          <div id="chat-input">
            <input type="text" placeholder="Type something.." />
            <button>
              <ArrowLeftIconSVG />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}