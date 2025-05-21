
export function AddFriendNoResult({ type }) {
  return (
    <div id="add-friend-no-result">
      <img src={
        type === "initial" ? "/user-initial.webp"
        : "/user-notfound.webp"}
      />
      <span>
        {
          type === "initial" ? "You can find your friend by searching their username above."
          : "Sorry... user not found." 
        }
      </span>
    </div>
  )
}