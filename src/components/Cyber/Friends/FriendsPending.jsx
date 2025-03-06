import { FriendsEmptyUI } from "./FriendsEmptyUI";
import { PendingCard } from "./PendingCard"

export function FriendsPending({ ownUid, friendRequestList }) {
  const pendingRequestList = friendRequestList.sort((a, b) => a.timeCreated - b.timeCreated).reverse();

  return (
    <div id="friends-pending">

        <h1>
          Pending Requests - {pendingRequestList.length}
        </h1>

        {
          pendingRequestList.length > 0 ?
            <div className="pending-cards overflow-y-support">
              {
                pendingRequestList.map((pendingRequest, index) => {
                  return (
                    <PendingCard
                      key={index + pendingRequest.uid}
                      ownUid={ownUid}
                      type={pendingRequest.type}
                      uid={pendingRequest.uid}
                      timeCreated={pendingRequest.timeCreated}
                    />
                  )
                })
              }
            </div>
          : <FriendsEmptyUI type={"pending"} />
        }
        
    </div>
  )
}

