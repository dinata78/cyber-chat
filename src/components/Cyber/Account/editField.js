import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { fetchDataFromUid } from "../../../utils"

export function editField(isEditMode, setIsEditMode, label, content, editedContent, isContentInvalid, setIsContentInvalid, isErrorInfoVisible, setIsErrorInfoVisible, setErrorInfo, ownUid) {
  
  if (isContentInvalid) setIsContentInvalid(false);
  if (isErrorInfoVisible) setIsErrorInfoVisible(false);

  if (!isEditMode) {
    setIsEditMode(true);
  }

  else if (editedContent === content) {
    setIsEditMode(false);
  }

  else {
    const updateField = async () => {
      const userDocRef = doc(db, "users", ownUid);
      const userDocData = await fetchDataFromUid(ownUid);
      
      if (label === "display name") {
        if (editedContent.length) {
          await updateDoc(userDocRef, {
            ...userDocData,
            displayName: editedContent,
          })
  
          setIsEditMode(false);  
        }
        else {
          setIsContentInvalid(true);
          setErrorInfo("Display name can't be empty.");
          setIsErrorInfoVisible(true);
        }

      }

      else if (label === "title") {
        await updateDoc(userDocRef, {
          ...userDocData,
          title: editedContent,
        })

        setIsEditMode(false);
      }

      else if (label === "bio") {
        await updateDoc(userDocRef, {
          ...userDocData,
          bio: editedContent,
        })
        
        setIsEditMode(false);
      }

      else if (label === "status") {
        const metadataDocRef = doc(db, "users", "metadata");
        const metadataDocData = await fetchDataFromUid("metadata");

        const metadataHiddenUsers = metadataDocData.hiddenUsers;

        if (editedContent === "Online") {

          if (metadataHiddenUsers.includes(ownUid)) {
            metadataHiddenUsers.splice(
              metadataHiddenUsers.indexOf(ownUid)
              , 1
            )

            await updateDoc(metadataDocRef, {
              ...metadataDocData,
              hiddenUsers: metadataHiddenUsers,
            })
          }
          
        }
        else {

          if (!metadataHiddenUsers.includes(ownUid)) {
            metadataHiddenUsers.push(ownUid);

            updateDoc(metadataDocRef, {
              ...metadataDocData,
              hiddenUsers: metadataHiddenUsers,
            })
          }

        }

        setIsEditMode(false);
      }

      else if (label === "username") {

        if (!editedContent.length) {
          setIsContentInvalid(true);
          setErrorInfo("Username can't be empty.");
          setIsErrorInfoVisible(true);
          return;
        }

        const metadataDocRef = doc(db, "users", "metadata");
        const metadataDocData = await fetchDataFromUid("metadata");
        const usernamesMap = metadataDocData.usernames;

        const usernamesList = Object.values(usernamesMap);

        const filteredEditedContent = editedContent.replaceAll(" ", "").toLowerCase();

        if (usernamesList.includes(filteredEditedContent)) {
          if (filteredEditedContent === content) {
            setIsEditMode(false);
          }
          else {
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
          
          setIsEditMode(false);
        }

        
      }
    }

    updateField();
  }
}