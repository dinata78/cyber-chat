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

export async function resetPassword(email) {
  if (!auth.currentUser.emailVerified) {
    throw new Error("email-not-verified");
  }

  try {
    await sendPasswordResetEmail(auth, null);
  }
  catch (error) {
    throw new Error(error.code);
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

export async function verifyEmail() {
  try {
    await sendEmailVerification(auth.currentUser);
  }
  catch (error) {
    throw new Error(error.code);
  }
}