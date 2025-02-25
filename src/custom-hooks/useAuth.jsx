import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { addNewConversationToDb, fetchDataFromUid } from "../utils";

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
        username: "",
        displayName: "Anonymous",
        bio: "Hello world!",
        title: "Newcomer",
        email: auth.currentUser.email,
        friendList: [],
        friendRequestSent: [],
        friendRequestReceived: [],
        inbox: [],
        isEmailVerified: false,
        isStatusHidden: false,
      });

      await addNewConversationToDb(auth.currentUser.uid);
      await addNewConversationToDb(auth.currentUser.uid, "28qZ6LQQi3g76LLRd20HXrkQIjh1");

      const devDocRef = doc(db, "users", "28qZ6LQQi3g76LLRd20HXrkQIjh1");
      const devDocData = await fetchDataFromUid("28qZ6LQQi3g76LLRd20HXrkQIjh1");

      await updateDoc(devDocRef, {
        ...devDocData,
        friendList: [
          ...devDocData.friendList,
          auth.currentUser.uid
        ],
      });

      const metadataDocRef = doc(db, "users", "metadata");
      const metadataDocData = await fetchDataFromUid("metadata");
      const usernamesMap = metadataDocData.usernames;
      usernamesMap[auth.currentUser.uid] = "";

      await updateDoc(metadataDocRef, {
        ...metadataDocData,
        usernames: usernamesMap, 
      });

    }
    catch (error) {
      console.error("Error occured while signing up: " + error);
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