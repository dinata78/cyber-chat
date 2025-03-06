
export function FriendsEmptyUI({ type }) {
  return (
    <div id="friends-empty-ui">
      <img src="/friends-empty.webp" />
      <div>
      <span>
        {
          type === "all" ?
            "You don't have any friend yet."  
          : type === "pending" ?
            "There are no pending friend requests."
          : "There are nothing in your inbox."
        }
      </span>
      <span>
        {
          type === "all" ?
            'You can go to "Pending" and check incoming friend requests.'
          : type === "pending" ?
            'Click "Add Friend" above to send friend requests.'
          : "You will be notified of everything here. Please check back later! " 
        }
      </span>
      <span>
        {
          type === "all" ?
            'Or click "Add Friend" above to send friend requests.'
          : null
        }
      </span>
      </div>
    </div>
  )
}