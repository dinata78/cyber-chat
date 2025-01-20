import { useState } from "react";
import { CloseSVG } from "../../svg/CloseSVG";
import { SearchIconSVG } from "../../svg/SearchIconSVG";
import { AddFriendNoResult } from "./AddFriendNoResult"; 
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../../../../firebase"
import { AddFriendProfile } from "./AddFriendProfile";

export function AddFriendModal({ setIsAddFriendModalVisible }) {
  const [resultStatus, setResultStatus] = useState("initial");
  const [usernameInput, setUsernameInput] = useState("");
  const [searchedUserData, setSearchedUserData] = useState({});

  const searchUser = async (username) => {
    if (!username.trim()) return;
    try {
      const userQuery = query(
        collection(db, "users"),
        where("username", "==", username),
        limit(1)
      )
      const searchedUserDoc = await getDocs(userQuery);
      const searchedUserData = searchedUserDoc.docs[0].data();
      const filteredUserData = {
        displayName: searchedUserData.name,
        username: searchedUserData.username,
        title: searchedUserData.title,
        bio: searchedUserData.bio,
        status: searchedUserData.status
      };
      
      setSearchedUserData(filteredUserData);
      setResultStatus("found");
    }
    catch {
      setResultStatus("not-found");
    }
  }

  return (
    <div id="add-friend-modal" onClick={() => setIsAddFriendModalVisible(false)}>
      <div onClick={(e) => e.stopPropagation()}>
        <div id="add-friend-modal-top">
          <h1>ADD FRIEND</h1>
          <div>
            <button onClick={() => setIsAddFriendModalVisible(false)}>
              <CloseSVG />
            </button>
          </div>
        </div>
        <hr />
        <div id="add-friend-modal-bottom">
          <div id="add-friend-input">
            <div>
              <SearchIconSVG />
            </div>
            <input type="text" placeholder="Search user with their username" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} />
            <button onClick={() => searchUser(usernameInput)}>Search</button>
          </div>
          {
            resultStatus === "found" ? 
              <>
              <AddFriendProfile searchedUserData={searchedUserData} />
              <button id="add-friend-button">SEND FRIEND REQUEST</button>
              </>
            : <AddFriendNoResult type={resultStatus} />
          }
        </div>
      </div>
    </div>
  )
}