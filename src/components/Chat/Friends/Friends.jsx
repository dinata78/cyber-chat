import { useContext, useEffect, useState } from "react";
import { ArrowLeftSVG, PlusSVG, SearchSVG } from "../../svg";
import { FriendCard } from "./FriendCard";
import { isContentSearched } from "../../../utils";
import { useDebouncedValue } from "../../../custom-hooks/useDebouncedValue";
import { collection, getDocs, limit, or, query, where } from "firebase/firestore";
import { db } from "../../../../firebase";
import { DMContext } from "../Chat";
import { AddFriendCard } from "./AddFriendCard";

export function Friends({ ownUid, friendUids, friendDatas, statusMap, messageFriend }) {
  const [ searchedFriendValue, setSearchedFriendValue ] = useState("");
  const [ isAddFriend, setIsAddFriend ] = useState(false);
  const [ addFriendDatas, setAddFriendDatas ] = useState({});
  const [ searchedAddValue, setSearchedAddValue ] = useState("");
  const debouncedAddValue = useDebouncedValue(searchedAddValue).trim();

  const { DMIds, isDMIdsLoading } = useContext(DMContext);

  const filteredFriendDatas = friendDatas.filter(friendData => {
    return isContentSearched(
      [friendData.displayName, friendData.username],
      searchedFriendValue
    );
  });
  
  useEffect(() => {
    if (debouncedAddValue) {
      const queryUserDatas = async () => {
        const userDatasQuery = query(
          collection(db, "users"),
          or (
            where("username", "==", debouncedAddValue),
            where("uid", "==", debouncedAddValue),
          ),
          limit(1)
        );
        const userDatasDocs = await getDocs(userDatasQuery);

        setAddFriendDatas(userDatasDocs.docs[0]?.data() ?? {});
      }

      queryUserDatas();
    }
    else {
      setAddFriendDatas({});
    }
  }, [debouncedAddValue])

  return (
    <>
      <div className="search-input">
        <input
          type="text"
          placeholder={
            !isAddFriend ? "Search Friends"
            : "Search by Username / ID"
          }
          value={
            !isAddFriend ? searchedFriendValue
            : searchedAddValue
          }
          onChange={(e) => {
            !isAddFriend ?
              setSearchedFriendValue(e.target.value)
            : setSearchedAddValue(e.target.value)
          }}
        />
        <div className="search-svg">
          <SearchSVG />
        </div>
      </div>

      {
        !isAddFriend ?
          <button className="toggle-add-friend" onClick={() => setIsAddFriend(true)}>
            <PlusSVG />
            Add Friend
          </button>
        : <button className="toggle-add-friend" onClick={() => setIsAddFriend(false)}>
            <ArrowLeftSVG />
            Friend List
          </button>
      }

      <div className="h-line"></div>

      {
        !isAddFriend ?
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
                    DMIds={DMIds}
                    isDMIdsLoading={isDMIdsLoading}
                  />
                )
              })
            }
          </div>
        : <div className="friend-cards overflow-y-support">
            {
              Object.keys(addFriendDatas).length > 0 &&
              <AddFriendCard
                ownUid={ownUid}
                friendUid={addFriendDatas.uid}
                friendPfpUrl={addFriendDatas.pfpUrl}
                friendDisplayName={addFriendDatas.displayName}
                friendUsername={addFriendDatas.username}
                friendBio={addFriendDatas.bio}
                messageFriend={messageFriend}
                DMIds={DMIds}
                isDMIdsLoading={isDMIdsLoading}
                friendUids={friendUids}
              />
            }
          </div>
      }
    </>
  )
}