import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { fetchDataFromUid } from "../../../utils";

export async function removeFriend(ownUid, friendUid) {
  const ownDocRef = doc(db, "users", ownUid);
  const ownDocData = await fetchDataFromUid(ownUid);

  const ownFriendList = ownDocData.friendList;

  ownFriendList.splice(
    ownFriendList.indexOf(friendUid)
    , 1
  );

  await updateDoc(ownDocRef, {
    ...ownDocData,
    friendList: ownFriendList,
  });
}