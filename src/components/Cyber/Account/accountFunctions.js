import { auth, realtimeDb } from "../../../../firebase";
import { deleteUser, sendPasswordResetEmail, signOut } from "firebase/auth";
import { ref, update } from "firebase/database";
import { deleteUserConversation, deleteUserData } from "../../../utils";
import { sendEmailVerification } from "firebase/auth";

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
  if (!auth.currentUser.emailVerified) {
    setModalType("reset-password-not-allowed");
    return;
  } 

  try {
    await sendPasswordResetEmail(auth, email);
    setModalType("reset-password-sent");
  }
  catch (error) {
    setModalType("reset-password-failed");
    console.error(error);
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

export async function verifyEmail(setModalType) {
  try {
    await sendEmailVerification(auth.currentUser);
    setModalType("verify-email-sent");
  }
  catch (error) {
    setModalType("verify-email-failed");
    console.error(error);
  }
}