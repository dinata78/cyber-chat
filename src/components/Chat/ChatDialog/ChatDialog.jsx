import { useEffect, useRef } from "react";
import { AccountArrowDownSVG, InboxSVG } from "../../svg";
import { RequestsDialog } from "./RequestsDialog";
import { InboxDialog } from "./InboxDialog";
import { addModalToStack, getTopModalFromStack, removeModalFromStack } from "../../modalStack";

export function ChatDialog({ ownUid, currentDialogNav, closeDialog, requestsButtonRef, inboxButtonRef, requests }) {

  const chatDialogRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (getTopModalFromStack() === "chat-dialog") {
          closeDialog();
          removeModalFromStack("chat-dialog");
        }
      }
    }

    const handleClick = (e) => {
      const dialogEl = chatDialogRef.current;
      const isOutsideClick =
        dialogEl && !dialogEl.contains(e.target) &&
        !requestsButtonRef.current?.contains(e.target) &&
        !inboxButtonRef.current?.contains(e.target);

      if (isOutsideClick && getTopModalFromStack() === "chat-dialog") {
        closeDialog();
        removeModalFromStack();
      }
    }

    addModalToStack("chat-dialog");
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClick);

    return () => {
      removeModalFromStack("chat-dialog");
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClick);
    }
  }, []);

  return (
    <div
      ref={chatDialogRef}
      id="chat-dialog"
    >
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
        <div className="cards-container overflow-y-support">
          {
            currentDialogNav === "requests" ?
              <RequestsDialog
                ownUid={ownUid}
                requests={requests}
              />
            : <InboxDialog />
          }
        </div>
      </div>
    </div>
  )
}