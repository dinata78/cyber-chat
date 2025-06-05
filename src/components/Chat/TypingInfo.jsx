
export function TypingInfo({ typingUids, chatDisplayNameMap }) {

  const renderedText = () => {
    if (!typingUids.length) { 
      return null;
    }
    else if (typingUids.length === 1) {
      return `${chatDisplayNameMap[typingUids[0]]} is typing...`
    }
    else if (typingUids.length === 2) {
      return chatDisplayNameMap[typingUids[0]] + " and " + chatDisplayNameMap[typingUids[1]] + " are typing..."
    }
    else {
      const othersAmount = typingUids.length - 2;
      const amountEnder = othersAmount > 1 ? " others" : " other";

      return (
        chatDisplayNameMap[typingUids[0]]
        + ", "
        + chatDisplayNameMap[typingUids[1]]
        + ", and "
        + othersAmount
        + amountEnder
        + " are typing..."
      )
    }
  }

  return (
    <span>
      {renderedText()}
    </span>
  )
}