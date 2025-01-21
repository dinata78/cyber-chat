
export function FriendsPending({ friendRequestReceivedList, friendRequestSentList }) {

  return (
    <div id="friends-pending">
      <h1>Pending - {friendRequestReceivedList.length + friendRequestSentList.length}</h1>
      <div className="friend cards">

      </div>
    </div>
  )
}