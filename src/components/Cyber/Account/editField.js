import { addDoc, collection, deleteDoc, doc, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../../../firebase";

export function editField(
  ownData,
  isEditMode,
  setIsEditMode,
  label,
  content,
  editedContent,
  isContentInvalid,
  setIsContentInvalid,
  isErrorInfoVisible,
  setIsErrorInfoVisible,
  setErrorInfo,
  usernames,
  hiddenUserUids
) {

  
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
      const ownDocRef = doc(db, "users", ownData.uid);
      
      if (label === "display name") {
        if (editedContent.length) {
          await updateDoc(ownDocRef, {
            ...ownData,
            displayName: editedContent,
          });
  
          setIsEditMode(false);
        }
        else {
          setIsContentInvalid(true)
          setErrorInfo("Display name can't be empty.");
          setIsErrorInfoVisible(true);
        }

      }

      else if (label === "title") {
        await updateDoc(ownDocRef, {
          ...ownData,
          title: editedContent,
        })

        setIsEditMode(false);
      }

      else if (label === "bio") {
        await updateDoc(ownDocRef, {
          ...ownData,
          bio: editedContent,
        })
        
        setIsEditMode(false);
      }

      else if (label === "status") {
        const hiddenUsersRef = collection(db, "users", "metadata", "hiddenUsers"); 

        if (editedContent === "Online") {

          if (hiddenUserUids.includes(ownData.uid)) {
            const ownHiddenUserQuery = query(
              hiddenUsersRef,
              where("uid", "==", ownData.uid),
              limit(1)
            )
            const ownHiddenUserDocs = await getDocs(ownHiddenUserQuery);
            await deleteDoc(ownHiddenUserDocs.docs[0].ref);
          }
        }

        else {

          if (!hiddenUserUids.includes(ownData.uid)) {
            await addDoc(hiddenUsersRef, {
              uid: ownData.uid,
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

        const usernameUids = Object.values(usernames);

        const filteredEditedContent = editedContent.replaceAll(" ", "").toLowerCase();

        if (usernameUids.includes(filteredEditedContent)) {
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
          const ownUsernameQuery = query(
            collection(db, "users", "metadata", "usernames"),
            where("uid", "==", ownData.uid),
            limit(1)
          )

          const ownUsernameDocs = await getDocs(ownUsernameQuery);

          await Promise.all([
            updateDoc(ownUsernameDocs.docs[0].ref, {
              ...ownUsernameDocs.docs[0].data(),
              username: filteredEditedContent,
            }),
  
            updateDoc(ownDocRef, {
              ...ownData,
              username: filteredEditedContent,
            })  
          ]);
          
          setIsEditMode(false);
        }

        
      }
    }

    updateField();
  }
}