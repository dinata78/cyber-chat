import { PendingCard } from "./PendingCard"

export function FriendsPending({ ownUid, friendRequestList }) {
  const pendingRequestList = friendRequestList.sort((a, b) => a.timeCreated - b.timeCreated).reverse();

  return (
    <div id="friends-pending">

        <h1>
          Pending Request - {pendingRequestList.length}
        </h1>
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

    </div>
  )
}