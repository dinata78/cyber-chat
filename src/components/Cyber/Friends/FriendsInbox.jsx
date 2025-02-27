import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { TrashCanSVG } from "../../svg/TrashCanSVG";
import { InboxCard } from "./InboxCard";
import { fetchDataFromUid } from "../../../utils";

export function FriendsInbox({ ownUid, inboxItems }) {

  const clearInbox = async () => {
    if (!inboxItems.length) return;

    const ownDocRef = doc(db, "users", ownUid);
    const ownDocData = await fetchDataFromUid(ownUid);

    await updateDoc(ownDocRef, {
      ...ownDocData,
      inbox: [],
    });
  }

  return (
    <div id="friends-inbox">

      <div className="top">
        <h1>Inbox - {inboxItems.length}</h1>
        <button
          title="Clear Inbox"
          onClick={clearInbox}
        >
          <TrashCanSVG />
        </button>
      </div>

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