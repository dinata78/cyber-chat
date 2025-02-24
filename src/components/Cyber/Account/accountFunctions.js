import { auth, realtimeDb } from "../../../../firebase";
import { deleteUser, sendPasswordResetEmail, signOut } from "firebase/auth";
import { ref, update } from "firebase/database";
import { deleteUserConversation, deleteUserData } from "../../../utils";

export async function logOut() {
  try {
    const dbRef = ref(realtimeDb, `users/${auth.currentUser.uid}`);

    await signOut(auth);
    await update(dbRef, { isOnline: false });
  }
  catch (error) {
    console.error("Log Out Failed: " + error);
  }
}

export async function resetPassword(email, setModalType) {
  try {
    await sendPasswordResetEmail(auth, email);
    setModalType("reset-password-sent");
  }
  catch (error) {
    console.error(error);
    setModalType("reset-password-failed");
  }
}

export async function deleteAccount(){
  try {    
    await deleteUserData(auth.currentUser.uid);
    await deleteUserConversation(auth.currentUser.uid);

    await deleteUser(auth.currentUser);
  }
  catch (error) {
    console.error(error);
    alert("Failed to delete the account.")
  }
}