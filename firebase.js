import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBhxRqthAHC7jOAjA18b1bSVXTfvqxRB9w",
  authDomain: "cyber-chat-78.firebaseapp.com",
  projectId: "cyber-chat-78",
  storageBucket: "cyber-chat-78.firebasestorage.app",
  messagingSenderId: "1092074312984",
  appId: "1:1092074312984:web:c6373958f8157757f6ba6d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);