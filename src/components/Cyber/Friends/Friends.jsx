import { useState } from "react"
import { SearchIconSVG } from "../../svg/SearchIconSVG";
import { FriendsAll } from "./FriendsAll";

export function Friends() {
  const [currentNav, setCurrentNav] = useState("all");

  const friendsButtonOnClick = (type) => {
    setCurrentNav(type);
  }

  return (
    <div id="cyber-friends">
      <div id="cyber-friends-nav">
        <h1>Friends</h1>
        <div className="divider"></div>
        <button className={currentNav === "all" ? "selected" : ""} onClick={() => friendsButtonOnClick("all")}>All</button>
        <button className={currentNav === "online" ? "selected" : ""} onClick={() => friendsButtonOnClick("online")}>Online</button>
        <button className={currentNav === "pending" ? "selected" : ""} onClick={() => friendsButtonOnClick("pending")}>Pending</button>
        <button className={currentNav === "inbox" ? "selected" : ""} onClick={() => friendsButtonOnClick("inbox")}>Inbox</button>
      
        <button id="add-friend" onClick={() => console.log(200)}>Add Friend</button>
      </div>
      <div id="cyber-friends-content">
        <div id="friends-search">
          <div>
            <SearchIconSVG />
          </div>
          <input type="text" />
        </div>
        
        {
          currentNav === "all" ? <FriendsAll />
          : null
        }
      </div>
    </div>
  )
}