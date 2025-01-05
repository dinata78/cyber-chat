import { FriendCard } from "./FriendCard";

export function Chats() {
  return (
    <div id="cyber-chats-container">
      <div id="cyber-chats-main">
        <h1>Chats</h1>
        <div id="friend-list">
          <FriendCard />
        </div>
      </div>

      <div id="cyber-chats-content"></div>
    </div>
  )
}