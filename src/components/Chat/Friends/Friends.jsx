import { useState } from "react";
import { SearchSVG } from "../../svg";
import { FriendCard } from "./FriendCard";
import { isContentSearched } from "../../../utils";

export function Friends({ ownUid, friendDatas, statusMap, setSelectedChatUid, setIsSidebarVisible }) {
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

      {
        filteredFriendDatas.length > 0 &&
        filteredFriendDatas.map((friendData, index) => {
          return (
            <FriendCard
              key={index + friendData.uid}
              ownUid={ownUid}
              friendUid={friendData.uid}
              friendDisplayName={friendData.displayName}
              friendUsername={friendData.username}
              friendStatus={statusMap[friendData.uid]}
              friendPfpUrl={friendData.pfpUrl}
              setSelectedChatUid={setSelectedChatUid}
              setIsSidebarVisible={setIsSidebarVisible}
            />
          )
        })
      }
    </>
  )
}