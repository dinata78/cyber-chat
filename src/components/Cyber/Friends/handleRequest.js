import { fetchDataFromUid } from "../../../utils";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { addInbox } from "./addInbox";

export async function handleRequest(type, ownUid, requestUid) {
  const ownDocRef = doc(db, "users", ownUid);
  const requestDocRef = doc(db, "users", requestUid);

  const ownDocData = await fetchDataFromUid(ownUid);
  const requestDocData = await fetchDataFromUid(requestUid);

  const ownFriendRequestReceived = ownDocData.friendRequestReceived;
  const requestFriendRequestSent = requestDocData.friendRequestSent;    
  
  ownFriendRequestReceived.splice(
    ownFriendRequestReceived.indexOf(requestUid)
    , 1
  );

  requestFriendRequestSent.splice(
    requestFriendRequestSent.indexOf(ownUid)
    , 1
  );

  if (type === "accept") {
    await updateDoc(ownDocRef, {
      ...ownDocData,
      friendRequestReceived: ownFriendRequestReceived,
      friendList: [...ownDocData.friendList, requestUid],
    });
  
    await updateDoc(requestDocRef, {
      ...requestDocData,
      friendRequestSent: requestFriendRequestSent,
      friendList: [...requestDocData.friendList, ownUid],
    });

    await addInbox(requestUid, "request-accepted", ownUid);
    await addInbox(requestUid, "friend-added", ownUid);
    await addInbox (ownUid, "friend-added", requestUid);
  }

  else if (type === "reject") {
    await updateDoc(ownDocRef, {
      ...ownDocData,
      friendRequestReceived: ownFriendRequestReceived,
    });
  
    await updateDoc(requestDocRef, {
      ...requestDocData,
      friendRequestSent: requestFriendRequestSent,
    });

    await addInbox(requestUid, "request-rejected", ownUid);
  }
  
}

export async function cancelRequest(ownUid, requestedUid) {
  const ownDocRef = doc(db, "users", ownUid);
  const requestedDocRef = doc(db, "users", requestedUid);

  const ownDocData = await fetchDataFromUid(ownUid);
  const requestedDocData = await fetchDataFromUid(requestedUid);

  const ownFriendRequestSent = ownDocData.friendRequestSent;
  const requestedFriendRequestReceived = requestedDocData.friendRequestReceived;

  ownFriendRequestSent.splice(
    ownFriendRequestSent.indexOf(requestedUid)
    , 1
  )

  requestedFriendRequestReceived.splice(
    requestedFriendRequestReceived.indexOf(ownUid)
    , 1
  )

  await updateDoc(ownDocRef, {
    ...ownDocData,
    friendRequestSent: ownFriendRequestSent,
  });

  await updateDoc(requestedDocRef, {
    ...requestedDocData,
    friendRequestReceived: requestedFriendRequestReceived,
  })

  await addInbox(ownUid, "cancel-request", requestedUid);
  await addInbox(requestedUid, "request-cancelled", ownUid);
  
}