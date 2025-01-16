import { AccountMinusSVG } from "../../svg/AccountMinusSVG";
import { ChatSVG } from "../../svg/ChatSVG";

export function FriendCard({ friendName, friendTitle }) {
  return (
    <div className="friend-card">
      <div className="friend-card-pfp">
        <img src="/empty-pfp.webp" />
      </div>
      <div className="friend-card-info">
        <span className="friend-card-name">{friendName}</span>
        <span className="friend-card-title">{friendTitle}</span>
      </div>
      <div className="friend-card-buttons">
        <button className="chat">
          <ChatSVG />
        </button>
        <button className="delete">
          <AccountMinusSVG />
        </button>
      </div>
    </div>
  )
}