import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { fetchDataFromUid } from "../../../utils"

export function editField(isEditMode, setIsEditMode, label, content, editedContent, setEditedContent, isContentInvalid, setIsContentInvalid, errorInfo, setErrorInfo, isErrorInfoVisible, setIsErrorInfoVisible, ownUid) {

  if (isContentInvalid) setIsContentInvalid(false);
  if (isErrorInfoVisible) setIsErrorInfoVisible(false);

  if (!isEditMode) {
    setIsEditMode(true);
  }

  else if (editedContent === content) {
    setEditedContent(editedContent);
    setIsEditMode(false);
  }

  else {
    const updateField = async () => {
      const userDocRef = doc(db, "users", ownUid);
      const userDocData = await fetchDataFromUid(ownUid);
      
      if (label === "display name") {
        await updateDoc(userDocRef, {
          ...userDocData,
          name: editedContent,
        })

        setEditedContent(editedContent);
        setIsEditMode(false);
      }
      else if (label === "bio") {
        await updateDoc(userDocRef, {
          ...userDocData,
          bio: editedContent,
        })
        
        setEditedContent(editedContent);
        setIsEditMode(false);
      }
      else if (label === "username") {

        const metadataDocRef = doc(db, "users", "metadata");
        const metadataDoc = await getDoc(metadataDocRef);
        const metadataDocData = metadataDoc.data();
        const usernamesMap = metadataDocData.usernames;

        const usernamesList = Object.values(usernamesMap);

        const filteredEditedContent = editedContent.replaceAll(" ", "").toLowerCase();

        if (usernamesList.includes(filteredEditedContent)) {
          if (filteredEditedContent === content) {
            setEditedContent(filteredEditedContent);
            setIsEditMode(false);
          }
          else {
            setEditedContent(filteredEditedContent);
            setIsContentInvalid(true);
            setErrorInfo("Username already exists.");
            setIsErrorInfoVisible(true);
          }
        }
        else {
          usernamesMap[ownUid] = filteredEditedContent;
          
          await updateDoc(userDocRef, {
            ...userDocData,
            username: filteredEditedContent,
          })
  
          await updateDoc(metadataDocRef, {
            ...metadataDocData,
            usernames: usernamesMap,
          })
          
          setEditedContent(filteredEditedContent);
          setIsEditMode(false);
        }

        
      }
    }

    updateField();
  }
}