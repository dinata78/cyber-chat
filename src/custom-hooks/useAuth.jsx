import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { addNewConversationToDb } from "../utils";

export function useAuth(setIsLoading) {
  const [signInData, setSignInData] = useState({email: "", password: ""});
  const [signUpData, setSignUpData] = useState({email: "", password: ""});

  const createAccount = async () => {
    if (!signUpData.email.trim() || !signUpData.password.trim()) return;

    try {
      setIsLoading(true);
      await createUserWithEmailAndPassword(
        auth,
        signUpData.email,
        signUpData.password,
      );

      const newDocId = auth.currentUser.uid;
      const newDocRef = doc(db, "users", newDocId);
      
      await setDoc(newDocRef, {
        uid: auth.currentUser.uid,
        username: "",
        displayName: "Anonymous",
        bio: "Hello world!",
        pfpUrl: "",
      });

      await addNewConversationToDb(auth.currentUser.uid);
      await addNewConversationToDb(
        auth.currentUser.uid,
        import.meta.env.VITE_DEV_UID
      );
    }
    catch (error) {
      throw new Error(error.code);
    }
    finally {
      setIsLoading(false);
    }
  }

  const logIn = async () => {
    if (!signInData.email.trim() || !signInData.password.trim()) return;
    
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(
        auth,
        signInData.email,
        signInData.password,
      );
    }
    catch (error) {
      throw new Error(error.code);
    }
    finally {
      setIsLoading(false);
    }
  }

  return {
    signInData,
    signUpData,
    setSignInData,
    setSignUpData,
    createAccount,
    logIn,
  }
}