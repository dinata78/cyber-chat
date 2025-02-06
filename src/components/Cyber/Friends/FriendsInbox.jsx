import { InboxCard } from "./InboxCard";

export function FriendsInbox({ inboxItems }) {

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