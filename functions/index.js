
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onDocumentUpdated } = require("firebase-functions/v2/firestore");

initializeApp();

function getConversationId(uid1, uid2) {
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


exports.testFunc = onCall(async (request) => {
  return {
    ok: true,
    uid: request.auth?.uid,
    args: request.data,
    currentTime: new Date().getTime(),
  };
});

exports.sendFriendRequest = onCall(async (request) => {
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
    })

    ok = true;
  }
  catch {
    ok = false;
  }

  return { ok }
});

exports.acceptFriendRequest = onCall(async (request) => {
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

exports.rejectFriendRequest = onCall(async (request) => {
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

exports.cancelFriendRequest = onCall(async (request) => {
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

exports.handleRequest = onDocumentUpdated("requests/{requestId}", async (event) => {
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
  }
  else if (status === "rejected") {
    await requestRef.delete();
  }
  else {
    await requestRef.delete();
  }
});