import { addNewConversationToDb, fetchDataFromUid } from "../../../utils";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { addInbox } from "./addInbox";

export async function handleRequest(type, ownUid, requestUid) {
  const ownDocRef = doc(db, "users", ownUid);
  const requestDocRef = doc(db, "users", requestUid);

  const ownDocData = await fetchDataFromUid(ownUid);
  const requestDocData = await fetchDataFromUid(requestUid);

  const ownFriendRequest = ownDocData.friendRequest;
  const requestFriendRequest = requestDocData.friendRequest;
  
  ownFriendRequest.splice(
    ownFriendRequest.findIndex((request) => request.type === "received" && request.uid === requestUid)
    , 1
  );
  requestFriendRequest.splice(
    requestFriendRequest.findIndex((request) => request.type === "sent" && request.uid === ownUid)
    , 1
  )

  await updateDoc(ownDocRef, {
    ...ownDocData,
    friendRequest: ownFriendRequest,
    friendList: [...ownDocData.friendList, requestUid],
  });

  await updateDoc(requestDocRef, {
    ...requestDocData,
    friendRequest: requestFriendRequest,
    friendList: [...requestDocData.friendList, ownUid],
  });

  if (type === "accept") {
    await addInbox(requestUid, "friend-added", ownUid);
    await addInbox(ownUid, "friend-added", requestUid);
    
    await addNewConversationToDb(ownUid, requestUid);  
  }
  else if (type === "reject") {
    await addInbox(requestUid, "request-rejected", ownUid);
  }
}

export async function cancelRequest(ownUid, requestedUid) {
  const ownDocRef = doc(db, "users", ownUid);
  const requestedDocRef = doc(db, "users", requestedUid);

  const ownDocData = await fetchDataFromUid(ownUid);
  const requestedDocData = await fetchDataFromUid(requestedUid);

  const ownFriendRequest = ownDocData.friendRequest;
  const requestedFriendRequest = requestedDocData.friendRequest;

  ownFriendRequest.splice(
    ownFriendRequest.findIndex((request) => request.type === "sent" && request.uid === requestedUid)
    , 1
  );

  requestedFriendRequest.splice(
    requestedFriendRequest.findIndex((request) => request.type === "received" && request.uid === ownUid)
    , 1
  )

  await updateDoc(ownDocRef, {
    ...ownDocData,
    friendRequest: ownFriendRequest,
  });

  await updateDoc(requestedDocRef, {
    ...requestedDocData,
    friendRequest: requestedFriendRequest,
  })

  await addInbox(ownUid, "request-cancel", requestedUid);
  await addInbox(requestedUid, "request-cancelled", ownUid);
  
}