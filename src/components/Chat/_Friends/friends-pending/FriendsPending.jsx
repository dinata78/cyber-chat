import { useEffect, useState } from "react";
import { isContentSearched, processDate } from "../../../../utils";
import { FriendsEmptyUI } from "../FriendsEmptyUI";
import { PendingCard } from "./PendingCard";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../firebase";

export function FriendsPending({ ownUid, requests, searchedInput }) {
  const [namesMap, setNamesMap] = useState({});
  
  const filteredRequests = requests.filter(request => {
    return isContentSearched(
      [
        request.type === "received" ?
          `[ ${processDate(request.timeCreated.toDate())} ] *${namesMap[request.uid]?.displayName || "..."} (@${namesMap[request.uid]?.username || "..."})* sent you a friend request!`
        : `[ ${processDate(request.timeCreated.toDate())} ] You sent *${namesMap[request.uid]?.displayName || "..."} (@${namesMap[request.uid]?.username || "..."})* a friend request!`
      ],
      searchedInput
    );
  });

  useEffect(() => {
    requests.forEach(async (request) => {
      const userDocRef = doc(db, "users", request.uid);
      const userDoc = await getDoc(userDocRef);
      const data = userDoc?.data();

      setNamesMap(prev => {
        const prevMap = {...prev};

        prevMap[request.uid] = { displayName: data?.displayName, username: data?.username };

        return prevMap;
      })

    });
  }, [requests]);

  return (
    <div id="friends-pending">

        <h1>
          Pending Requests - {filteredRequests.length}
        </h1>

        {
          filteredRequests.length > 0 ?
            <div className="pending-cards overflow-y-support">
              {
                filteredRequests.map((request, index) => {
                  return (
                    <PendingCard
                      key={index + request.timeCreated + index}
                      ownUid={ownUid}
                      type={request.type}
                      names={namesMap[request.uid]}
                      uid={request.uid}
                      timeCreated={request.timeCreated}
                      isUnread={request.isUnread}
                    />
                  )
                })
              }
            </div>
          : <FriendsEmptyUI type="pending" />
        }
        
    </div>
  )
}

