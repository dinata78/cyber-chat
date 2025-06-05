import { doc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../../firebase";

export function useTrackTyping(conversationId, ownUid, messageValue, typingUids) {
  const modifyTypingUids = async (type) => {
    const conversationRef = doc(db, "conversations", conversationId);

    let newTypingUids = typingUids;

    if (type === "add") {
      newTypingUids.push(ownUid);
    }
    else if (type === "remove"){
      newTypingUids.splice(
        typingUids.indexOf(ownUid), 1
      );
    }

    await updateDoc(conversationRef, {
      typingUids: newTypingUids, 
    });
  }

  useEffect(() => {
    if (!ownUid) return;

    if (messageValue.length && !typingUids.includes(ownUid)) {
      modifyTypingUids("add");
    }
    else if (!messageValue.length && typingUids.includes(ownUid)) {
      modifyTypingUids("remove");
    }
  }, [messageValue, typingUids]);

}