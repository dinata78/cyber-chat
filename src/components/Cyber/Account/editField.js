import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { fetchDataFromUid } from "../../../utils"

export function editField(isEditMode, setIsEditMode, label, editContent, ownUid) {
  if (!isEditMode) {
    setIsEditMode(true);
  }
  else {
    const updateField = async () => {
      const userDocRef = doc(db, "users", ownUid);
      const userDocData = await fetchDataFromUid(ownUid);
      
      if (label === "display name") {
        await updateDoc(userDocRef, {
          ...userDocData,
          name: editContent,
        })
      }
      else if (label === "bio") {
        await updateDoc(userDocRef, {
          ...userDocData,
          bio: editContent,
        })
      }
      else if (label === "username") {
        await updateDoc(userDocRef, {
          ...userDocData,
          username: editContent,
        })
      }
    }

    updateField();
    setIsEditMode(false);
  }
}