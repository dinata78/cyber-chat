import { FriendCard } from "./FriendCard";
import { PlusIconSVG } from "../../svg/PlusIconSVG";
import { SearchIconSVG } from "../../svg/SearchIconSVG";
import { ArrowLeftIconSVG } from "../../svg/ArrowLeftIconSVG";
import { MessageCard } from "./MessageCard";
import { useState } from "react";

export function Chats() {
  const [currentChat, setCurrentChat] = useState(null);
  const [currentChatData, setCurrentChatData] = useState({});

  const onFriendCardClick = (friendName, friendTitle) => {
    setCurrentChat(friendName);
    setCurrentChatData({
      name: friendName,
      title: friendTitle, 
  });
  }

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
          <FriendCard friendName="Global Chat" friendTitle="A global room everyone can access." currentChat={currentChat} onFriendCardClick={onFriendCardClick} />
          <FriendCard friendName="Steven Dinata" friendTitle="Developer of CyberChat" currentChat={currentChat} onFriendCardClick={onFriendCardClick} />
        </div>
      </div>

      <div id="cyber-chats-content">
        <div id="chats-content-top">
          <div id="current-chat-pfp-container">
            <img id="current-chat-pfp" src="/empty-pfp.webp" />
          </div>
          <div id="current-chat-info">
            <span id="current-chat-name">{currentChatData.name}</span>
            <span id="current-chat-title">{currentChatData.title}</span>
          </div>
        </div>

        <div id="chats-content-bottom">
          <div id="chat-display">
            <MessageCard senderName="Steven Dinata" content="Test test" isOwnMessage={false} />
            <MessageCard senderName="Anonymous" content="Test test" isOwnMessage={true} />
            <MessageCard senderName="Anonymous 2" content="Lorem ipsum afjdaslf jasfjlkasdj fdjasklf dasl. Lf adfja fajslfaj flasjfl ajslfjdal fjlasjf ldasj f, klfadsf ladsjklf ad. Jaldfadlkfja dlfdalsf ajsdkfa fladsjflksaf dasfj lasj adfa adfas faadfff, adfjaslfjdaskl jdaf asdfljs ajdkslf jadsfa. Ladfajflak falajfal alaj fa. Adajflkasjf afajsk fjas fsakfjaskf dasjfdsak fjsad fas das." isOwnMessage={false} />
            <MessageCard senderName="Anonymous" content="??" isOwnMessage={true} />
            <MessageCard senderName="Anonymous" content="???" isOwnMessage={true} />

          </div>
          

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