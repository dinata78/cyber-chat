import { useEffect, useState } from "react"
import { SearchIconSVG } from "../../svg/SearchIconSVG";
import { FriendsAll } from "./FriendsAll";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { AddFriendModal } from "./AddFriendModal";
import { FriendsPending } from "./FriendsPending";

export function Friends() {
  const [currentNav, setCurrentNav] = useState("all");
  const [friendUidList, setFriendUidList] = useState([]);
  const [friendDataList, setFriendDataList] = useState([]);

  const [friendRequestSentList, setFriendRequestSentList] = useState([]);
  const [friendRequestReceivedList, setFriendRequestReceivedList] = useState([]);
  const [friendRequestSentDataList, setFriendRequestSentDataList] = useState([]);
  const [friendRequestReceivedDataList, setFriendRequestReceivedDataList] = useState([]);

  const [isAuthChanged, setIsAuthChanged] = useState(false);
  const [isAddFriendModalVisible, setIsAddFriendModalVisible] = useState(false);

  const friendsButtonOnClick = (navType) => {
    setCurrentNav(navType);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setIsAuthChanged((prev) => !prev);
    })

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribe;

    const fetchFriendList = async () => {
      const userDocRef = doc(db, "users", auth.currentUser.uid);

      unsubscribe = onSnapshot(userDocRef, (snapshot) => {
        const friendList = snapshot.data().friendList;
        setFriendUidList(friendList);
      });
    }

    fetchFriendList();

    return () => {
      if (unsubscribe) unsubscribe();
    }

  }, [isAuthChanged]);

  useEffect(() => {
    if (friendUidList.length < 1) return;

    const fetchFriendData = async () => {
      const data = [];
      for (const friendUid of friendUidList) {
        const friendDocRef = doc(db, "users", friendUid);
        const friendDoc = await getDoc(friendDocRef);
        data.push(friendDoc.data());
      }
      setFriendDataList(data);
    }

    fetchFriendData();
  }, [friendUidList]);

  useEffect(() => {
    let unsubscribe;

    const fetchFriendRequestList = async () => {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      unsubscribe = onSnapshot(userDocRef, (snapshot) => {
        const data = snapshot.data();

        setFriendRequestSentList(data.friendRequestSent);
        setFriendRequestReceivedList(data.friendRequestReceived);
      })
    }

    fetchFriendRequestList();

    return () => {
      if (unsubscribe) unsubscribe();
    } 

  }, [isAuthChanged]);

  return (
    <div id="cyber-friends">
      <div id="cyber-friends-nav">
        <h1>Friends</h1>
        <div className="divider"></div>
        <button className={currentNav === "all" ? "selected" : ""} onClick={() => friendsButtonOnClick("all")}>All</button>
        <button className={currentNav === "pending" ? "selected" : ""} onClick={() => friendsButtonOnClick("pending")}>Pending</button>
        <button className={currentNav === "inbox" ? "selected" : ""} onClick={() => friendsButtonOnClick("inbox")}>Inbox</button>
        <button id="add-friend" onClick={() => setIsAddFriendModalVisible(true)}>Add Friend</button>
      </div>
      <div id="cyber-friends-content">
        <div id="friends-search">
          <div>
            <SearchIconSVG />
          </div>
          <input type="text" />
        </div>
        
        {
          currentNav === "all" ? <FriendsAll friendDataList={friendDataList} />
          : currentNav === "pending" ? <FriendsPending friendRequestReceivedList={friendRequestReceivedList} friendRequestSentList={friendRequestSentList} />
          : null
        }
      </div>
      {
        isAddFriendModalVisible &&
        <AddFriendModal 
          setIsAddFriendModalVisible={setIsAddFriendModalVisible} 
          friendRequestSentList={friendRequestSentList} 
        />
      }
    </div>
  )
}