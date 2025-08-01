import { CheckDecagramSVG } from "../../svg";

export function EmptyDialog({ currentDialogNav }) {
  return (
    <div className="empty-dialog">
      <CheckDecagramSVG />
      {
        currentDialogNav === "requests" ?
          "No pending friend requests."
        : "No notifications."
      }
    </div>
  )
}