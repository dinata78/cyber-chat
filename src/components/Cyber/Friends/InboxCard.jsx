import { useName } from "../../../custom-hooks/useName";

export function InboxCard({ type, uid }) {
  const { displayName, username } = useName(uid);

  if (!displayName || !username) return null;

  if (type === "request-sent") {
    return (
      <div className="inbox-card">
        <span>
          You
          sent <b style={{color: "#aaddff"}}>{displayName} (@{username})</b> a
          friend request.
        </span>
      </div>
    )
  }

  else if (type === "request-received") {
    return (
      <div className="inbox-card">
        <span>
          You received a friend request 
          from <b style={{color: "#aaddff"}}>{displayName} (@{username})</b>.
        </span>
      </div>
    )
  }

  else if (type === "request-accepted") {
    return (
      <div className="inbox-card">
        <span>
          <b style={{color: "#aaddff"}}>{displayName} (@{username})</b> accepted
          your friend request.
        </span>
      </div>
    )
  }

  else if (type === "request-rejected") {
    return (
      <div className="inbox-card">
        <span>
          <b style={{color: "#aaddff"}}>{displayName} (@{username})</b> rejected
          your friend request.
        </span>
      </div>
    )
  }

  else if (type === "friend-added") {
    return (
      <div className="inbox-card">
        <span>
          <b style={{color: "#aaddff"}}>{displayName} (@{username})</b> is
          now your friend.
        </span>
      </div>
    )
  }

  else if (type === "friend-removed") {
    return (
      <div className="inbox-card">
        <span>
          <b style={{color: "#aaddff"}}>{displayName} (@{username})</b> is
          no longer your friend.
        </span>
      </div>
    )
  }

  else if (type === "cancel-request") {
    return (
      <div className="inbox-card">
        <span>
          You have cancelled your friend request 
          to <b style={{color: "#aaddff"}}>{displayName} (@{username})</b>.
        </span>
      </div>
    )
  }

  else if (type === "request-cancelled") {
    return (
      <div className="inbox-card">
        <span>
          <b style={{color: "#aaddff"}}>{displayName} (@{username})</b> had
          cancelled their friend request for you. 
        </span>
      </div>
    )
  }

}