import { useUnreadFriendRequest } from "../../../custom-hooks/useUnreadFriendRequest";
import { FriendsEmptyUI } from "./FriendsEmptyUI";
import { PendingCard } from "./PendingCard";

export function FriendsPending({ ownData, friendRequest }) {
  const { unreadRequestIds } = useUnreadFriendRequest(ownData);
  
  const pendingRequestList = friendRequest.sort((a, b) => a.timeCreated - b.timeCreated).reverse();

  return (
    <div id="friends-pending">

        <h1>
          Pending Requests - {pendingRequestList.length}
        </h1>

        {
          pendingRequestList.length > 0 ?
            <div className="pending-cards overflow-y-support">
              {
                pendingRequestList.map((request, index) => {
                  return (
                    <PendingCard
                      key={index + request.uid}
                      ownUid={ownData.uid}
                      type={request.type}
                      uid={request.uid}
                      timeCreated={request.timeCreated}
                      isUnread={unreadRequestIds.includes(request.id)}
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

