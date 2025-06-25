import { useEffect, useRef } from "react";
import { AccountArrowDownSVG, CheckDecagramSVG, InboxSVG } from "../../svg";

export function ChatDialog({ currentDialogNav, closeDialog, requestsButtonRef, inboxButtonRef }) {
  const chatDialogRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        currentDialogNav &&
        requestsButtonRef.current &&
        inboxButtonRef.current &&
        chatDialogRef.current &&
        !requestsButtonRef.current.contains(e.target) &&
        !inboxButtonRef.current.contains(e.target) &&
        !chatDialogRef.current.contains(e.target)
      ) {
        closeDialog();
      };
    }

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [currentDialogNav]);

  return (
    <div ref={chatDialogRef} id="chat-dialog">
      <div className="top">
        {
          currentDialogNav === "requests" ?
            <>
              <AccountArrowDownSVG />
              Friends Requests
            </>
          : <>
              <InboxSVG />
              Inbox
            </>
        }
      </div>
      <div className="bottom">
        <div className="empty-dialog">
          <CheckDecagramSVG />
          {
            currentDialogNav === "requests" ?
              "No pending friend requests."
            : "No notifications."
          }
        </div>
      </div>
    </div>
  )
}