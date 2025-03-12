import { processDate } from "../../../../utils";

export function InboxCard({ content, timeCreated, isUnread }) {

  return (
    <div className={isUnread ? "inbox-card unread" : "inbox-card"}>
      <span>
        [ {processDate(timeCreated.toDate())} ] {content}
      </span>
    </div>
  )
}