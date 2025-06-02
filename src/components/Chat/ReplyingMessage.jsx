
export function ReplyingMessage({ replyingMessage, senderPfpUrl, senderDisplayName }) {
  return (
    <div className="replying-message">
      <div className="v-line"></div>
      <div className="h-line"></div>
      <img src={senderPfpUrl} />
      <span
        className="text-overflow-support"
      >
        {senderDisplayName}
      </span>
      <span
        className="text-overflow-support"
        style={{
          flexGrow: "1",
          width: "0",
          marginLeft: "4px",
          color: "#d1d5db"
        }}
      >
        {
          replyingMessage.type === "text" ?
            replyingMessage.content || "<deleted>"
          : "[Image]"
        }
      </span>
    </div>
  )
}