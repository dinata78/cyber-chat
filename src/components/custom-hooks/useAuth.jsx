import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { auth, db } from "../../../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

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
        signUpData.password
      );

      const newDocId = auth.currentUser.uid;
      const newDocRef = doc(db, "users", newDocId);
      
      await setDoc(newDocRef, {
        uid: auth.currentUser.uid,
        username: null,
        name: "Anonymous",
        bio: "Hello world!",
        title: "Newcomer",
        email: auth.currentUser.email,
        chatList: [],
        friendList: [],
        friendRequestSent: [],
        friendRequestReceived: [],
      });
    }
    catch (error) {
      console.log("Error occured while signing up: " + error);
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
        signInData.password
      );
    }
    catch (error) {
      console.error("Error occured while signing in: " + error)
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
    logIn
  }
}