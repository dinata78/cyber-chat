import { useState } from "react";
import { EditSVG } from "../../svg/EditSVG"
import { CheckSVG } from "../../svg/CheckSVG";
import { getMaxChar } from "./getMaxChar";
import { editField } from "./editField";
import { normalizeSpaces } from "../../../utils";

export function AccountDataCard({ label, content, ownUid }) { 
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ editedContent, setEditedContent ] = useState(content);
  const [ isContentInvalid, setIsContentInvalid ] = useState(false);
  const [ errorInfo, setErrorInfo ] = useState("");
  const [ isErrorInfoVisible, setIsErrorInfoVisible ] = useState(false);

  const editContent = (e) => {
    const maxChar = getMaxChar(label);

    if (e.target.value.length <= maxChar) {
      if (isContentInvalid) setIsContentInvalid(false);
      if (isErrorInfoVisible) setIsErrorInfoVisible(false);

      setEditedContent(e.target.value);
    }
    else {
      setIsContentInvalid(true);
      setErrorInfo("Character limit reached.")
      setIsErrorInfoVisible(true);
    }
  }

  return (
    <div className="account-data-card">

      <button
        onClick={
          () => 
            editField(
              isEditMode,
              setIsEditMode,
              label,
              content,
              normalizeSpaces(editedContent),
              setEditedContent,
              isContentInvalid,
              setIsContentInvalid,
              isErrorInfoVisible,
              setIsErrorInfoVisible,
              setErrorInfo,
              ownUid
            )
        }
      >
        {label.toUpperCase()}
        {
          !isEditMode ? <EditSVG /> : <CheckSVG />
        }
      </button>  

      {
        !isEditMode ?
          <span className="content overflow-y-support">
            {content ? content : "(Not Set)"}
          </span>
        : 
          ["username", "display name"].includes(label) ?
            <input 
              type="text"
              className={
                isContentInvalid ? 
                  "invalid"
                : null
              }
              value={editedContent}
              onChange={editContent}
            />
          : label === "status" ?
            <select
              defaultValue={content}
              onChange={
                (e) => setEditedContent(e.target.value)
              }
            >
              <option value="Online">Online</option>
              <option value="Hidden">Hidden</option>
            </select>
          : label === "title" ?
            <select 
              defaultValue={content}
              onChange={
                (e) => setEditedContent(e.target.value)
              }
            >
              <option value="Newcomer">Newcomer</option>
              <option value="Edgerunner">Edgerunner</option>
              <option value="Netrunner">Netrunner</option>
            </select>
          : <textarea
              className={
                isContentInvalid ?
                  "invalid overflow-y-support"
                : "overflow-y-support"
              }
              value={editedContent}
              onChange={editContent}
            >
              {content}
            </textarea>
      }
      
      {
        !["status", "title"]
        .includes(label) &&
        isEditMode &&
          <span className="char-tracker">
            {editedContent.length} / {getMaxChar(label)}
          </span>
      }

      {
        isErrorInfoVisible &&
          <span className="error-info">
            {errorInfo}
          </span>
      }

    </div>
  )
}