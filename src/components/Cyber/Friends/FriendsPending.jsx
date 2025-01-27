import { PendingCard } from "./PendingCard"

export function FriendsPending({ friendRequestSentList, friendRequestReceivedList }) {

  return (
    <div id="friends-pending">

      <div>
        <h1>
          Pending Request 
          - {friendRequestSentList.length 
              + friendRequestReceivedList.length}
        </h1>
        <div className="pending-cards overflow-y-support">
          {
            friendRequestSentList.map((requestSentUid) => {
              return (
                <PendingCard
                  type="sent"
                  uid={requestSentUid}
                />
              )
            })
          }
          {
            friendRequestReceivedList.map((requestReceivedUid) => {
              return (
                <PendingCard
                  type="received"
                  uid={requestReceivedUid}
                />
              )
            })
          }
        </div>
      </div>

    </div>
  )
}