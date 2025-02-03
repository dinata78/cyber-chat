import { useInbox } from "../../../custom-hooks/useInbox"
import { InboxCard } from "./InboxCard";

export function FriendsInbox({ ownUid }) {
  const { inboxItems } = useInbox(ownUid);

  return (
    <div id="friends-inbox">

      <h1>Inbox - {inboxItems.length}</h1>

      <div className="inbox-cards overflow-y-support">
        {
          inboxItems.map((item, index) => {
            return (
              <InboxCard
                key={index + item.uid}
                type={item.type}
                uid={item.uid}
              />
            )
          })
        }
      </div>
      
    </div>
  )
}