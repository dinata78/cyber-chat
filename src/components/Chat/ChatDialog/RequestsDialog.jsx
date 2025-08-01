import { EmptyDialog } from "./EmptyDialog";
import { RequestsCard } from "./RequestsCard";

export function RequestsDialog({ ownUid, requests }) {
  const orderedRequests = requests.sort((a, b) => a.timeCreated - b.timeCreated);

  return (
    requests.length > 0 ?
      <>
        {
          orderedRequests.map(request => {
            return (
              <RequestsCard
                key={request.id}
                type={
                  request.from === ownUid ?
                    "sent"
                  : "received"
                }
                id={request.id}
                from={request.from}
                to={request.to}
                timeCreated={request.timeCreated}
              />
            )
          })
        }
      </>
    : <EmptyDialog currentDialogNav={"requests"} />
  )
}