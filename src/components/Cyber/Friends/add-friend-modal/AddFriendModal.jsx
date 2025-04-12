import { useEffect, useRef, useState } from "react";
import { AddFriendNoResult } from "./AddFriendNoResult"; 
import { collection, getDocs, limit, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../../../firebase"
import { AddFriendProfile } from "./AddFriendProfile";
import { AddFriendButton } from "./AddFriendButton";
import { CloseSVG, SearchSVG } from "../../../svg";

export function AddFriendModal({ ownUid, setIsAddFriendModalVisible, friendUids, requests }) {
  const [resultStatus, setResultStatus] = useState("initial");
  const [usernameInput, setUsernameInput] = useState("");

  const [searchedUsername, setSearchedUsername] = useState("");
  const [searchedUserData, setSearchedUserData] = useState({});

  const inputRef = useRef(null);

  const inputUsername = (e) => {
    const filteredInput = e.target.value.replaceAll(" ", "").toLowerCase();

    setUsernameInput(filteredInput);
  }
  
  const searchUser = async () => {    
    setSearchedUsername(usernameInput);
  }

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (!searchedUsername) return;

    const userDataQuery = query(
      collection(db, "users"),
      where("username", "==", usernameInput),
      limit(1)
    );

    let unsubscribe = null;

    const fetchAndSetUserData = async () => {
      
      const userDataDocs = await getDocs(userDataQuery)
      const userDataDocRef = userDataDocs.docs[0]?.ref;

      if (userDataDocRef) {
        unsubscribe = onSnapshot(userDataDocRef, (snapshot) => {
          setSearchedUserData(snapshot.data());
          setResultStatus("found");
        });
      }
      else {
        setResultStatus("not-found")
      }

    }

    fetchAndSetUserData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    }
    
  }, [searchedUsername]);

  return (
    <div id="add-friend-modal" onClick={() => setIsAddFriendModalVisible(false)}>
      <div onClick={(e) => e.stopPropagation()}>

        <div id="add-friend-top">
          <h1>ADD FRIEND</h1>
          <div>
            <button onClick={() => setIsAddFriendModalVisible(false)}>
              <CloseSVG />
            </button>
          </div>
        </div>

        <hr />

        <div id="add-friend-bottom">
          <div id="add-friend-input">
            <div>
              <SearchSVG />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search user with their username"
              value={usernameInput}
              onChange={inputUsername}
              onKeyDown={(e) => {
                if (e.key === "Enter") searchUser();
              }}
            />
            <button onClick={searchUser}>Search</button>
          </div>
          {
            resultStatus === "found" ?
              <>
                <AddFriendProfile searchedUserData={searchedUserData} />      
                <AddFriendButton
                  ownUid={ownUid}
                  searchedUserData={searchedUserData}
                  friendUids={friendUids}
                  requests={requests}
                />
              </>
            : <AddFriendNoResult type={resultStatus} />
          }
        </div>

      </div>
    </div>
  )
}