import { auth, realtimeDb } from "../../../../firebase";
import { deleteUser, sendPasswordResetEmail, signOut } from "firebase/auth";
import { ref, update } from "firebase/database";
import { deleteUserConversation, deleteUserData, deleteUserStatusFromDb } from "../../../utils";
import { sendEmailVerification } from "firebase/auth";

export async function logOut() {
  try {
    const dbRef = ref(realtimeDb, `users/${auth.currentUser.uid}`);

    await update(dbRef, { isOnline: false });
    await signOut(auth);
    
  }
  catch (error) {
    console.error("Error while logging out: " + error);
  }
}

export async function resetPassword(email) {
  if (!auth.currentUser.emailVerified) {
    throw new Error("email-not-verified");
  }

  try {
    await sendPasswordResetEmail(auth, email);
  }
  catch (error) {
    throw new Error(error.code);
  }
}

export async function deleteAccount(){
  try {    
    await deleteUserConversation(auth.currentUser.uid);
    await deleteUserData(auth.currentUser.uid);
    await deleteUserStatusFromDb(auth.currentUser.uid);
    await deleteUser(auth.currentUser);
  }
  catch (error) {
    console.error(error);
    alert("Failed to delete the account.");
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