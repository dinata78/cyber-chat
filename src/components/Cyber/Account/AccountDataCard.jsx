import { useState } from "react";
import { EditSVG } from "../../svg/EditSVG"
import { CheckSVG } from "../../svg/CheckSVG";
import { getMaxChar } from "./getMaxChar";
import { editField } from "./editField";

export function AccountDataCard({ label, content, ownUid }) { 
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ editedContent, setEditedContent ] = useState(content);
  const [ isContentFull, setIsContentFull ] = useState(false);

  const editContent = (e) => {
    const maxChar = getMaxChar(label.toLowerCase());

    if (e.target.value.length <= maxChar) {
      if (isContentFull) setIsContentFull(false);

      setEditedContent(e.target.value);
    }
    else {
      setIsContentFull(true);
    }
  }

  return (
    <div className="account-data-card">

      {
        ["username", "display name", "bio"]
        .includes(label.toLowerCase()) ?
        <button
          onClick={
            () => 
              editField(
                isEditMode,
                setIsEditMode,
                label.toLowerCase(),
                content,
                editedContent.trim(),
                setEditedContent,
                isContentFull,
                setIsContentFull,
                ownUid
              )
          }
        >
          {label}
          {
            !isEditMode ?
              <EditSVG />
            : <CheckSVG />
          }
        </button>
        : <span className="label">{label}</span>
      }

      {
        !isEditMode ?
          <span className="content">
            {
              content ? content
              : "(Not Set)"
            }
          </span>
        : 
          label.toLowerCase() !== "bio" ?
            <input 
              type="text"
              className={
                isContentFull ?
                  "full"
                : null
              }
              value={editedContent}
              onChange={editContent}
            />
          : <textarea
              className={
                isContentFull ?
                  "full overflow-y-support"
                : "overflow-y-support"
              }
              value={editedContent}
              onChange={editContent}
            >
              {content}
            </textarea>
      }
      
      {
        ["username", "display name", "bio"]
        .includes(label.toLowerCase())  &&
        isEditMode &&
          <span className="char-tracker">
            {editedContent.length} / {getMaxChar(label.toLowerCase())}
          </span>
      }

    </div>
  )
}