import { collection, deleteDoc, getDocs, limit, query, where } from "firebase/firestore";
import { getConversationId } from "../../../utils"
import { ChatCard } from "./ChatCard"
import { db } from "../../../../firebase";

export function Chats({ ownData, ownStatus, devData, DMDatas, statusMap, unreadCountMap, selectedChatUid, setSelectedChatUid, setIsSidebarVisible }) {

  const conversationId = getConversationId(ownData.uid, selectedChatUid);

  const hideDM = async () => {
    if (!ownData.uid || !conversationId) return;

    const activeDMQueryRef = query(
      collection(db, "users", ownData.uid, "activeDM"),
      where("conversationId", "==", conversationId),
      limit(1)
    );

    const activeDMDocs = await getDocs(activeDMQueryRef);

    if (activeDMDocs.docs.length) {
      await deleteDoc(activeDMDocs.docs[0].ref);
      setSelectedChatUid("");
    }
  }

  return (
    <>
      <ChatCard
        ownUid={ownData.uid}
        uid={"globalChat"}
        displayName={"Global Chat"}
        username={null}
        status={"online"}
        pfpUrl={null}
        unreadMessagesCount={0}
        selectedChatUid={selectedChatUid}
        setSelectedChatUid={setSelectedChatUid}
        setIsSidebarVisible={setIsSidebarVisible}
      />

      <ChatCard
        ownUid={ownData.uid}
        uid={devData.uid}
        displayName={devData.displayName}
        username={devData.username}
        status={statusMap[devData.uid]}
        pfpUrl={devData.pfpUrl}
        unreadMessagesCount={unreadCountMap[getConversationId(ownData.uid, devData.uid)] || 0}
        selectedChatUid={selectedChatUid}
        setSelectedChatUid={setSelectedChatUid}
        setIsSidebarVisible={setIsSidebarVisible}
      />

      <ChatCard
        ownUid={ownData.uid}
        uid={ownData.uid}
        displayName={
          ownData.displayName ? ownData.displayName + " (You)"
          : null
        }
        username={ownData.username}
        status={ownStatus}
        pfpUrl={ownData.pfpUrl}
        unreadMessagesCount={0}
        selectedChatUid={selectedChatUid}
        setSelectedChatUid={setSelectedChatUid}
        setIsSidebarVisible={setIsSidebarVisible}
      />

      <div className="tag">
        <hr />
        <label>DIRECT MESSAGES</label>
        <hr />
      </div>

      <div className="chat-cards overflow-y-support">
        {
          DMDatas.map((dm, index) => {
            const conversationId = getConversationId(ownData.uid, dm.uid);
            return (
              <ChatCard
                key={dm.uid + index}
                ownUid={ownData.uid}
                uid={dm.uid}
                displayName={dm.displayName}
                username={dm.username}
                status={statusMap[dm.uid]}
                pfpUrl={dm.pfpUrl}
                unreadMessagesCount={unreadCountMap[conversationId]}
                selectedChatUid={selectedChatUid}
                setSelectedChatUid={setSelectedChatUid}
                setIsSidebarVisible={setIsSidebarVisible}
                isDM={true}
                hideDM={hideDM}
              />
            )
          })
        }
      </div>                
    </>
  )
}