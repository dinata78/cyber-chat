import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../../../../firebase";

export function EditInput({ closeEdit, conversationId, messageId, isSubset, content }) {
  
  const [ editedMessage, setEditedMessage ] = useState(content);
  
  const inputContainerRef = useRef(null);
  const inputRef = useRef(null);

  const resizeInput = () => {
    inputContainerRef.current.style.height = "auto";
    inputContainerRef.current.style.height = `${inputRef.current.scrollHeight + 24}px`;
  }

  const inputEditedMessage = (e) => {
    if (e.target.value.length < 10000) {
      setEditedMessage(e.target.value);
    }
  }

  const saveEdit = async () => {
    closeEdit();

    const filtered = editedMessage.trim();

    if (!filtered || filtered === content) return;

    const currentMessageRef = doc(db, "conversations", conversationId, "messages", messageId);

    await updateDoc(currentMessageRef, {
      isEdited: true,
      content: filtered,
    });
  }
  
  useEffect(() => {
    resizeInput();

    inputRef.current.focus();
    inputRef.current.selectionStart = inputRef.current.value.length;
    inputRef.current.selectionEnd = inputRef.current.value.length;
  }, []);

  return (
    <div
      id="edit-input"
      style={{
        paddingLeft: isSubset ? "68px" : null,
        paddingRight: isSubset ? "12px" : null
      }}
    >
      <div
        ref={inputContainerRef}
        className="input-container"
      >
        <textarea
          ref={inputRef}
          className="input overflow-y-support"
          rows={1}
          placeholder={content}
          value={editedMessage}
          onChange={inputEditedMessage}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              saveEdit();
            }
            else if (e.key === "Escape") {
              e.preventDefault();
              closeEdit();
            }
          }}
          onInput={resizeInput}
        >
        </textarea>
      </div>

      <div className="bottom">
        <span>{"escape to "}</span>

        <button onClick={closeEdit}>
          cancel
        </button>

        <span>{" or enter to "}</span>

        <button onClick={saveEdit}>
          save
        </button>
      </div>
    </div>
  )
}