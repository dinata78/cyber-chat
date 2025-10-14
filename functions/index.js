
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onDocumentUpdated, onDocumentCreated } = require("firebase-functions/v2/firestore");

initializeApp();

const getConversationId = (uid1, uid2) => {
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

const getUidsFromConversationId = (conversationId) => {
  if (conversationId.length !== 56) return null;

  return [
    conversationId.slice(0, 28),
    conversationId.slice(28, 56)
  ]
}

const sendNotification = async (type, data) => {
  if (type === "new-friend") {
    const fromUserData = await getFirestore()
      .collection("users")
      .doc(data.fromUid)
      .get();

    const toUserData = await getFirestore()
      .collection("users")
      .doc(data.toUid)
      .get();

    if (!fromUserData.exists || !toUserData.exists) return;

    await getFirestore()
    .collection("users")
    .doc(data.fromUid)
    .collection("inbox")
    .add({
      type: "new-friend",
      name: `${toUserData.data().displayName} (@${toUserData.data().username})`,
      timeCreated: FieldValue.serverTimestamp()
    });

    await getFirestore()
    .collection("users")
    .doc(data.toUid)
    .collection("inbox")
    .add({
      type: "new-friend",
      name: `${fromUserData.data().displayName} (@${fromUserData.data().username})`,
      timeCreated: FieldValue.serverTimestamp()
    });
  }
  else if (type === "friend-removed") {
    const firstUserData = await getFirestore()
      .collection("users")
      .doc(data.firstUserUid)
      .get();

    const secondUserData = await getFirestore()
      .collection("users")
      .doc(data.secondUserUid)
      .get();

    if (!firstUserData.exists || !secondUserData.exists) return;

    await getFirestore()
    .collection("users")
    .doc(data.firstUserUid)
    .collection("inbox")
    .add({
      type: "friend-removed",
      name: `${secondUserData.data().displayName} (@${secondUserData.data().username})`,
      timeCreated: FieldValue.serverTimestamp()
    });

    await getFirestore()
    .collection("users")
    .doc(data.secondUserUid)
    .collection("inbox")
    .add({
      type: "friend-removed",
      name: `${firstUserData.data().displayName} (@${firstUserData.data().username})`,
      timeCreated: FieldValue.serverTimestamp()
    });
  }
  else if (type === "request-rejected") {
    const toUidData = await getFirestore()
      .collection("users")
      .doc(data.toUid)
      .get();

    if (!toUidData.exists) return;

    await getFirestore()
    .collection("users")
    .doc(data.fromUid)
    .collection("inbox")
    .add({
      type: "request-rejected",
      name: `${toUidData.data().displayName} (@${toUidData.data().username})`,
      timeCreated: FieldValue.serverTimestamp()
    });
  }
}

const deleteImageFromDb = async (url) => {  
  try {
    const formData = new FormData();
    formData.append("imageUrl", url);
  
    const response = await fetch(
      "https://cyberchat.mediastorage.workers.dev/image/delete",
      {
        method: "DELETE",
        body: formData,
      }
    );
  
    const data = await response.json();
    return { ok: data.success }
  }
  catch {
    return { ok: false }
  }
}

const deleteConversation = async (conversationId) => {
  const batch = getFirestore().batch();
  let imageUrls = [];
  
  const conversationRef = getFirestore()
    .collection("conversations")
    .doc(conversationId);
  
  const messagesDocs = await conversationRef
    .collection("messages")
    .get();

  messagesDocs.docs.forEach((doc) => {
    if (doc.data().type === "image") {
      imageUrls.push(doc.data().content);
    }
    batch.delete(doc.ref);
  });

  batch.delete(conversationRef);

  await batch.commit();

  if (imageUrls.length) {
    await Promise.all(
      imageUrls.map(url => deleteImageFromDb(url))
    );
  }
}

// Https Callable

exports.sendFriendRequest = onCall({region: "asia-east1"}, async (request) => {
  let ok;

  const senderUid = request.auth?.uid;
  const targetUid = request.data?.uid;

  if (!senderUid || !targetUid) return;

  try {
    await getFirestore()
    .collection("requests")
    .doc(senderUid + targetUid)
    .create({
      from: senderUid,
      to: targetUid,
      status: "pending",
      timeCreated: FieldValue.serverTimestamp()
    });

    ok = true;
  }
  catch {
    ok = false;
  }

  return { ok }
});

exports.acceptFriendRequest = onCall({region: "asia-east1"}, async (request) => {
  let ok;

  const ownUid = request.auth?.uid;
  const requestId = request.data?.requestId;

  if (!ownUid || !requestId) return;

  const requestRef = getFirestore()
    .collection("requests")
    .doc(requestId);
  
  const requestData = await requestRef.get();

  if (requestData.data()?.to === ownUid) {
    try {
      await requestRef.update({ status: "accepted" });
      ok = true;
    }
    catch {
      ok = false;
    }
  }
  else {
    ok = false;
  }

  return { ok }
});

exports.rejectFriendRequest = onCall({region: "asia-east1"}, async (request) => {
  let ok;

  const ownUid = request.auth?.uid;
  const requestId = request.data?.requestId;

  if (!ownUid || !requestId) return;

  const requestRef = getFirestore()
    .collection("requests")
    .doc(requestId);
  
  const requestData = await requestRef.get();

  if (requestData.data()?.to === ownUid) {
    try {
      await requestRef.update({ status: "rejected" });
      ok = true;
    }
    catch {
      ok = false;      
    }    
  }
  else {
    ok = false;
  }

  return { ok }
});

exports.cancelFriendRequest = onCall({region: "asia-east1"}, async (request) => {
  let ok;

  const ownUid = request.auth?.uid;
  const requestId = request.data?.requestId;

  if (!ownUid || !requestId) return;

  const requestRef = getFirestore()
    .collection("requests")
    .doc(requestId);
  
  const requestData = await requestRef.get();

  if (requestData.data()?.from === ownUid) {
    try {
      await requestRef.delete();
      ok = true;
    }
    catch {
      ok = false;
    }
  }
  else {
    ok = false;
  }

  return { ok }
});

exports.removeFriend = onCall({region: "asia-east1"}, async (request) => {
  let ok;

  const ownUid = request.auth?.uid;
  const friendUid = request.data?.uid;

  if (!ownUid | !friendUid) return;

  try {
    await getFirestore()
    .collection("deletions")
    .doc(ownUid + friendUid)
    .create({
      type: "friend-deletion",
      uids: [ownUid, friendUid]
    });

    ok = true;
  }
  catch {
    ok = false;
  }

  return { ok }
});

// Background Triggers

exports.handleRequests = onDocumentUpdated(
  {
    document: "requests/{requestId}",
    region: "asia-east1",
  },
  async (event) => {
    const requestId = event.params.requestId;

    if (!requestId) return;

    const requestRef = getFirestore()
    .collection("requests")
    .doc(requestId);

    const requestData = await requestRef.get();

    if (!requestData.exists) return;

    const fromUid = requestData.data().from;
    const toUid = requestData.data().to;
    const status = requestData.data().status;

    if (status === "accepted") {
      await getFirestore()
      .collection("users")
      .doc(fromUid)
      .collection("friendList")
      .add({ uid: toUid });

      await getFirestore()
      .collection("users")
      .doc(toUid)
      .collection("friendList")
      .add({ uid: fromUid });

      await getFirestore()
      .collection("conversations")
      .doc(getConversationId(fromUid, toUid))
      .create({ participants: [fromUid, toUid] });

      await requestRef.delete();

      await sendNotification("new-friend", { fromUid, toUid });
    }
    else if (status === "rejected") {
      await requestRef.delete();

      await sendNotification("request-rejected", { fromUid, toUid });
    }
    else {
      await requestRef.delete();
    }
  }
);

exports.handleDeletions = onDocumentCreated(
  {
    document: "deletions/{deletionId}",
    region: "asia-east1",
  }, 
  async (event) => {
    const deletionId = event.params.deletionId;

    if (!deletionId) return;

    const deletionDocRef = getFirestore()
    .collection("deletions")
    .doc(deletionId);

    const deletionDocData = await deletionDocRef.get();

    if (!deletionDocData.exists) return;

    const type = deletionDocData.data().type;

    if (type === "friend-deletion") {
      const uids = deletionDocData.data().uids;
      const firstUserUid = uids[0];
      const secondUserUid = uids[1];

      const conversationId = getConversationId(firstUserUid, secondUserUid);

      // Remove each other's activeDM doc

      const firstUserActiveDMQuery = await getFirestore()
      .collection("users")
      .doc(firstUserUid)
      .collection("activeDM")
      .where("conversationId", "==", conversationId)
      .limit(1)
      .get();

      const secondUserActiveDMQuery = await getFirestore()
      .collection("users")
      .doc(secondUserUid)
      .collection("activeDM")
      .where("conversationId", "==", conversationId)
      .limit(1)
      .get();

      await firstUserActiveDMQuery.docs[0]?.ref.delete();
      await secondUserActiveDMQuery.docs[0]?.ref.delete();

      // Remove each user from their friend's friendList

      const firstUserFriendListQuery = await getFirestore()
      .collection("users")
      .doc(firstUserUid)
      .collection("friendList")
      .where("uid", "==", secondUserUid)
      .limit(1)
      .get();

      const secondUserFriendListQuery = await getFirestore()
      .collection("users")
      .doc(secondUserUid)
      .collection("friendList")
      .where("uid", "==", firstUserUid)
      .limit(1)
      .get();

      await firstUserFriendListQuery.docs[0]?.ref.delete();
      await secondUserFriendListQuery.docs[0]?.ref.delete();

      // Delete all of their conversation's data
    
      await deleteConversation(conversationId);

      // Send friend removed notifications

      await sendNotification("friend-removed", { firstUserUid, secondUserUid });
    }

    // Delete deletion doc

    await getFirestore()
    .collection("deletions")
    .doc(deletionId)
    .delete();
  }
);

exports.handleShowActiveDM = onDocumentCreated(
  {
    document: "conversations/{conversationId}/messages/{messageId}",
    region: "asia-east1",
  },
  async (event) => {
    const conversationId = event.params.conversationId;

    if (conversationId.length !== 56) return;

    const uids = getUidsFromConversationId(conversationId);
    
    const firstUserRef = getFirestore()
    .collection("users")
    .doc(uids[0]);

    const secondUserRef = getFirestore()
    .collection("users")
    .doc(uids[1]);

    //update each user's activeDM collection

    const firstUserActiveDMQuery = await firstUserRef
    .collection("activeDM")
    .where("conversationId", "==", conversationId)
    .limit(1)
    .get();

    const secondUserActiveDMQuery = await secondUserRef
    .collection("activeDM")
    .where("conversationId", "==", conversationId)
    .limit(1)
    .get();

    const firstUserActiveDMRef = firstUserActiveDMQuery.docs[0]?.ref;
    const secondUserActiveDMRef = secondUserActiveDMQuery.docs[0]?.ref;

    if (firstUserActiveDMRef) {
      await firstUserActiveDMRef
      .update({
        lastActive: FieldValue.serverTimestamp(),
      })
    }
    else {
      await firstUserRef
      .collection("activeDM")
      .add({
        conversationId: conversationId,
        lastActive: FieldValue.serverTimestamp(),
      })
    }

    if (secondUserActiveDMRef) {
      await secondUserActiveDMRef
      .update({
        lastActive: FieldValue.serverTimestamp(),
      })
    }
    else {
      await secondUserRef
      .collection("activeDM")
      .add({
        conversationId: conversationId,
        lastActive: FieldValue.serverTimestamp(),
      })
    }
  }
)