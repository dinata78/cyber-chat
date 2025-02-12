import { useState } from "react";
import { EditSVG } from "../../svg/EditSVG"
import { CheckSVG } from "../../svg/CheckSVG";
import { getMaxChar } from "./getMaxChar";
import { editField } from "./editField";

export function AccountDataCard({ label, content, ownUid }) { 
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ editContent, setEditContent ] = useState(content);

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
                editContent,
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
          <span className="content">{content}</span>
        : 
          label.toLowerCase() !== "bio" ?
            <input 
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          : <textarea
          className="overflow-y-support"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            >
              {content}
            </textarea>
      }
      
      {
        ["username", "display name", "bio"]
        .includes(label.toLowerCase())  &&
        isEditMode &&
          <span className="char-tracker">
            {editContent.length} / {getMaxChar(label.toLowerCase())}
          </span>
      }
    </div>
  )
}