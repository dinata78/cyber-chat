import { EmptyDialog } from "./EmptyDialog";
import { InboxCard } from "./InboxCard";

export function InboxDialog({ ownUid, inbox }) {
  const orderedInbox = inbox.sort((a, b) => b.timeCreated - a.timeCreated);

  return (
    inbox.length > 0 ?
      <>
        {
          orderedInbox.map(inbox => {
            return (
              <InboxCard
                key={inbox.id}
                ownUid={ownUid}
                id={inbox.id}
                type={inbox.type}
                name={inbox.name}
                timeCreated={inbox.timeCreated}
              />
            )
          })
        }
      </>
    : <EmptyDialog currentDialogNav={"inbox"} />
  )
} 