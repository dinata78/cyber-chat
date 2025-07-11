import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app, import.meta.env.VITE_FIREBASE_RTDB_REF_URL);
export const functions = getFunctions(app);

if (location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "localhost", 8081);
  connectDatabaseEmulator(realtimeDb, "localhost", 9001);
  connectFunctionsEmulator(functions, "localhost", 5001)
}
else if (location.hostname.startsWith("192.168")) {
  connectAuthEmulator(auth, "http://192.168.1.12:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "192.168.1.12", 8081);
  connectDatabaseEmulator(realtimeDb, "192.168.1.12", 9001);
  connectFunctionsEmulator(functions, "192.168.1.12", 5001)  
}