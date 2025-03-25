import { useState } from "react";
import { EditSVG } from "../../../svg/EditSVG";
import { CheckSVG } from "../../../svg/CheckSVG";
import { collection, doc, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../../../../firebase";

export function AccountUsername({ content, ownData, usernames }) { 
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ editedContent, setEditedContent ] = useState(content);
  const [ isContentInvalid, setIsContentInvalid ] = useState(false);
  const [ errorInfo, setErrorInfo ] = useState("");
  const [ isErrorInfoVisible, setIsErrorInfoVisible ] = useState(false);

  const editContent = (e) => {

    if (e.target.value.length <= 15) {
      if (isContentInvalid) setIsContentInvalid(false);
      if (isErrorInfoVisible) setIsErrorInfoVisible(false);

      setEditedContent(e.target.value);
    }
    else {
      setErrorInfo("Character limit reached.")
      setIsContentInvalid(true);
      setIsErrorInfoVisible(true);
    }
  }

  const editOnClick = async () => {
    if (isContentInvalid) setIsContentInvalid(false);
    if (isErrorInfoVisible) setIsErrorInfoVisible(false);  

    if (!isEditMode) {
      setIsEditMode(true);
    }
    else {
      const filteredEditedContent = editedContent.replaceAll(" ", "").toLowerCase();

      if (filteredEditedContent !== content) {
        if (!filteredEditedContent.length) {
          setErrorInfo("Username can't be empty.");
          setIsContentInvalid(true);
          setIsErrorInfoVisible(true);
          return;
        }
        
        const usernamesUidList = Object.values(usernames);

        if (usernamesUidList.includes(filteredEditedContent)) {
          setErrorInfo("Username already exists.");
          setIsContentInvalid(true);
          setIsErrorInfoVisible(true);
          return;
        }
        else {
          const ownDocRef = doc(db, "users", ownData.uid);
          const ownUsernameQuery = query(
            collection(db, "users", "metadata", "usernames"),
            where("uid", "==", ownData.uid),
            limit(1)
          );

          const ownUsernameDocs = await getDocs(ownUsernameQuery);

          await Promise.all([
            updateDoc(ownDocRef, {
              ...ownData,
              username: filteredEditedContent,
            }),

            updateDoc(ownUsernameDocs.docs[0].ref, {
              ...ownUsernameDocs.docs[0].data(),
              username: filteredEditedContent,
            })
          ]);

        }
      }
      setIsEditMode(false);
    }
  }

  return (
    <div className="account-data-card">

      <button onClick={editOnClick}> 
        USERNAME
        <div className="button-svg">
          {!isEditMode ? <EditSVG /> : <CheckSVG />}
        </div>
      </button>

      {
        !isEditMode ?
          <span className="content overflow-y-support">
            {content ? content : "(Not Set)"}
          </span>
        : <input 
            type="text"
            className={isContentInvalid ? "invalid" : ""}
            value={editedContent}
            onChange={editContent}
          />
      }

      {
        isEditMode &&
        <span className="char-tracker">
          {editedContent.length} / 15
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