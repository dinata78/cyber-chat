import { processDate } from "../../../utils";

export function InboxCard({ content, timeCreated }) {

  return (
    <div className="inbox-card">
      <span>[ {processDate(timeCreated.toDate())} ] {content}</span>
    </div>
  )
}