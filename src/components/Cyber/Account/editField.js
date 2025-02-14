import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { fetchDataFromUid } from "../../../utils"

export function editField(isEditMode, setIsEditMode, label, content, editedContent, ownUid) {
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
        await updateDoc(userDocRef, {
          ...userDocData,
          name: editedContent,
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
      else if (label === "username") {

        const metadataDocRef = doc(db, "users", "metadata");
        const metadataDoc = await getDoc(metadataDocRef);
        const metadataDocData = metadataDoc.data();
        const usernamesMap = metadataDocData.usernames;

        const usernamesList = Object.values(usernamesMap);

        if (usernamesList.includes(editedContent)) {
          alert("Username already existed.")
        }
        else {
          usernamesMap[ownUid] = editedContent;
          
          await updateDoc(userDocRef, {
            ...userDocData,
            username: editedContent,
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