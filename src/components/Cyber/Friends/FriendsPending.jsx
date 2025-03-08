import { useUnreadRequests } from "../../../custom-hooks/useUnreadRequests";
import { FriendsEmptyUI } from "./FriendsEmptyUI";
import { PendingCard } from "./PendingCard";

export function FriendsPending({ ownUid, requests }) {
  
  const { unreadRequestIds } = useUnreadRequests(ownUid, requests.length);

  return (
    <div id="friends-pending">

        <h1>
          Pending Requests - {requests.length}
        </h1>

        {
          requests.length > 0 ?
            <div className="pending-cards overflow-y-support">
              {
                requests.map((request, index) => {
                  return (
                    <PendingCard
                      key={index + request.timeCreated + index}
                      ownUid={ownUid}
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

