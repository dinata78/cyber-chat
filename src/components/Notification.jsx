import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertSVG, ClipboardSVG } from "./svg";

let notifyGlobal;

export function notify(type, message) {
  notifyGlobal?.({ type, message });
}

export function Notifier() {
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    notifyGlobal = setNotif;

    return () => {
      notifyGlobal = null;
    };
  }, []);

  useEffect(() => {
    if (!notif) return;

    const timer = setTimeout(() => {
      setNotif(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [notif]);

  if (!notif) return null;

  return createPortal(
    <div
      id="notification"
      style={{fill: notif.type === "text-copied" ? "lime" : "red"}}
    >
      {
        notif.type === "text-copied" ? <ClipboardSVG />
        : <AlertSVG />
      }
      <span>{notif.message}</span>
    </div>,
    document.body
  );
}