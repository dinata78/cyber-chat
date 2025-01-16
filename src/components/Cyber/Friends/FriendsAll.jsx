import { FriendCard } from "./FriendCard";

export function FriendsAll() {
  return (
    <div id="friends-all">
      <h1>All Friends - 0</h1>
      <div className="friend-cards">
        <FriendCard friendName="Zero Flugel" friendTitle="Hero of Dawn" />
      </div>
    </div>
  )
}