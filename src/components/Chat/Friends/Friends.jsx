import { useState } from "react";
import { PlusSVG, SearchSVG } from "../../svg";
import { FriendCard } from "./FriendCard";
import { isContentSearched } from "../../../utils";

export function Friends({ ownUid, friendDatas, statusMap, messageFriend }) {
  const [ searchedValue, setSearchedValue ] = useState("");

  const filteredFriendDatas = friendDatas.filter(friendData => {
    return isContentSearched(
      [friendData.displayName, friendData.username],
      searchedValue
    );
  })

  return (
    <>
      <div className="search-input">
        <input
          type="text"
          placeholder="Search Friends"
          value={searchedValue}
          onChange={(e) => setSearchedValue(e.target.value)}
        />
        <div className="search-svg">
          <SearchSVG />
        </div>
      </div>

      <button className="add-friend">
        <PlusSVG />
        Add Friend
      </button>

      <div className="h-line"></div>

      <div className="friend-cards overflow-y-support">
        {
          filteredFriendDatas.length > 0 &&
          filteredFriendDatas.map((friendData, index) => {
            return (
              <FriendCard
                key={index + friendData.uid}
                ownUid={ownUid}
                friendUid={friendData.uid}
                friendPfpUrl={friendData.pfpUrl}
                friendDisplayName={friendData.displayName}
                friendUsername={friendData.username}
                friendBio={friendData.bio}
                friendStatus={statusMap[friendData.uid]}
                messageFriend={messageFriend}
              />
            )
          })
        }
      </div>
    </>
  )
}