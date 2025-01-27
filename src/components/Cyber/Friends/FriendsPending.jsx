
export function FriendsPending({ friendRequestSentList, friendRequestReceivedList }) {

  return (
    <div id="friends-pending">
      <h1>Pending - {friendRequestSentList.length + friendRequestReceivedList.length}</h1>
      <div className="friend-cards">
        
      </div>
    </div>
  )
}