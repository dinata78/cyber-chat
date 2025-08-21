import { EmptyDialog } from "./EmptyDialog";
import { RequestsCard } from "./RequestsCard";

export function RequestsDialog({ ownUid, requests }) {
  const orderedRequests = requests.sort((a, b) => b.timeCreated - a.timeCreated);

  return (
    requests.length > 0 ?
      <>
        {
          orderedRequests.map(request => {
            return (
              <RequestsCard
                key={request.id}
                id={request.id}
                type={
                  request.from === ownUid ?
                    "sent"
                  : "received"
                }
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