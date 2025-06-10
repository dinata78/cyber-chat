import { ChatCard } from "./ChatCard"

export function Chats({ ownData, ownStatus, devData, DMDatas, statusMap, selectedChatUid, setSelectedChatUid, setIsSidebarVisible }) {
  return (
    <>
      <ChatCard
        ownUid={ownData.uid}
        uid={"globalChat"}
        displayName={"Global Chat"}
        username={null}
        status={"online"}
        pfpUrl={null}
        unreadMessagesCount={null}
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
        unreadMessagesCount={7}
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
        unreadMessagesCount={9}
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
            return (
              <ChatCard
                key={dm.uid + index}
                ownUid={ownData.uid}
                uid={dm.uid}
                displayName={dm.displayName}
                username={dm.username}
                status={statusMap[dm.uid]}
                pfpUrl={dm.pfpUrl}
                unreadMessagesCount={0}
                selectedChatUid={selectedChatUid}
                setSelectedChatUid={setSelectedChatUid}
                setIsSidebarVisible={setIsSidebarVisible}
              />
            )
          })
        }
      </div>                
    </>
  )
}