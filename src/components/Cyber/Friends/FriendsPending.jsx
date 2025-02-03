import { PendingCard } from "./PendingCard"

export function FriendsPending({ ownUid, friendRequestSentList, friendRequestReceivedList }) {

  return (
    <div id="friends-pending">

        <h1>
          Pending Request 
          - {friendRequestSentList.length 
              + friendRequestReceivedList.length}
        </h1>
        <div className="pending-cards overflow-y-support">
          {
            friendRequestSentList.map((requestSentUid, index) => {
              return (
                <PendingCard
                  key={index + requestSentUid}
                  ownUid={ownUid}
                  type="sent"
                  uid={requestSentUid}
                />
              )
            })
          }
          {
            friendRequestReceivedList.map((requestReceivedUid, index) => {
              return (
                <PendingCard
                  key={index + requestReceivedUid}
                  ownUid={ownUid}
                  type="received"
                  uid={requestReceivedUid}
                />
              )
            })
          }
        </div>

    </div>
  )
}