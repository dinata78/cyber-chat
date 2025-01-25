import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export function getConversationId(uid1, uid2) {
  if (typeof uid1 !== "string" || typeof uid2 !== "string") return null;
  if (uid1 === "globalChat" || uid2 === "globalChat") return "globalChat";
  if (uid1 === uid2) return uid1;
  if (uid1.length !== uid2.length) return null;
  
  let i = 0;
  while (true) {
    const uid1Charcode = uid1.charCodeAt(i);
    const uid2Charcode = uid2.charCodeAt(i);

    if (uid1Charcode < uid2Charcode) return uid1 + uid2;
    else if (uid1Charcode > uid2Charcode) return uid2 + uid1;
    else i++;
  }
};

export async function fetchDataFromUid(uid) {
  const docRef = doc(db, "users", uid);
  const response = await getDoc(docRef);
  const data = response.data();
  
  return data;
}

export function getIndicatorClass(status) {
  if (status === "online") return "indicator online";
  else return "indicator offline";
}