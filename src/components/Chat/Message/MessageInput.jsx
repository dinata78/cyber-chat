import { useEffect, useRef, useState } from "react";
import { CloseCirleSVG, ImageSVG, SendSVG } from "../../svg";
import { getConversationId } from "../../../utils";
import { db } from "../../../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useProcessImageFile } from "../../../custom-hooks/useProcessImageFile";
import { notify } from "../../Notification";
import { previewImage } from "../../ImagePreview";
import { ReplyingMessagePopup } from "./ReplyingMessagePopup";

export function MessageInput({ messagesRef, messageInputRef, inputContainerRef, focusMessageInput, resizeMessageInput, messageValueMap, setMessageValueMap, replyingId, replyingMessage, replyingMessageSenderName, stopReplying, editLastMessage, ownUid, selectedChatUid }) 
{
  const [ chosenImageFile, setChosenImageFile ] = useState(null);
  const [ chosenImageData, setChosenImageData ] = useState({ url: "", name: ""});

  const imageInputRef = useRef(null);

  const conversationId = getConversationId(ownUid, selectedChatUid);
  const messageValue = messageValueMap[conversationId] || "";

  const setMessageValue = (newValue) => {
    setMessageValueMap(prev => {
      const map = {...prev};
      if (newValue === "") {
        delete map[conversationId];
      }
      else {
        map[conversationId] = newValue;
      }
      return map;
    });
  }

  const inputMessage = (e) => {
    if (e.target.value.length < 2000) {
      setMessageValue(e.target.value);
    }
  }

  const clearChosenImage = () => {
    imageInputRef.current.value = null;
    setChosenImageFile(null);
    setChosenImageData({ url: "", name: "", width: 0, height: 0 });
  }

  const sendMessage = async () => {
    let newMessage = messageValue.trim();

    setMessageValue("");
    stopReplying();
    requestAnimationFrame(() => {
      resizeMessageInput();
      focusMessageInput();
    });

    if (chosenImageFile) {
      const imageFile = chosenImageFile;
      clearChosenImage();

      try {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await fetch(
          "https://cyberchat.mediastorage.workers.dev/image/chats/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        const url = data?.secure_url;

        if (url) {
          newMessage = url;

          const imagesRef = collection(db, "images");

          await addDoc(imagesRef, {
            url: url,
            name: chosenImageFile.name,
            sizeInBytes: chosenImageFile.size
          });
        }
      }
      catch (error) {
        console.error(error)
        notify(null, "Failed to send image.");
      }
    }

    if (!newMessage) return;

    const messagesRef = collection(db, "conversations", conversationId, "messages");

    await addDoc(messagesRef, {
      type: chosenImageFile ? "image" : "text",
      isReplyingId: replyingId,
      isEdited: false,
      isDeleted: false,
      content: newMessage,
      senderUid: ownUid,
      timeCreated: new Date(),
      isUnread: ["globalChat", ownUid].includes(selectedChatUid) ? false : true,
    });
  }

  useProcessImageFile(chosenImageFile, setChosenImageData, clearChosenImage);

  useEffect(() => {
    resizeMessageInput();

    window.addEventListener("resize", resizeMessageInput);

    return () => window.removeEventListener("resize", resizeMessageInput);
  }, []);

  return (
    <div className="message-input" ref={inputContainerRef}>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpg, image/jpeg, image/png, image/webp"
        style={{display: "none", pointerEvents: "none"}}
        onChange={(e) => {
          setChosenImageFile(e.target.files[0]);
          requestAnimationFrame(() => {
            inputContainerRef.current.style.height = "auto";
          })
        }}
      />

      <button
        style={{left: "0"}}
        onClick={() => imageInputRef.current.click()}
      >
        <ImageSVG />
      </button>

      {
        !chosenImageFile ?
          <textarea
            ref={messageInputRef}
            className="overflow-y-support"
            type="text"
            rows={1}
            placeholder="Type something.."
            value={messageValue}
            onChange={inputMessage}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
              else if (e.key === "ArrowUp") {
                if (!messageValue.length) {
                  editLastMessage();
                } 
              }
            }}
            onInput={resizeMessageInput}
          >
          </textarea>
        : <div className="img-attached">
            <button
              onClick={() => {
                clearChosenImage();
                requestAnimationFrame(() => {
                  resizeMessageInput();
                  focusMessageInput();
                })
              }}
            >
              <CloseCirleSVG />
            </button>
            <img
              src={chosenImageData.url || "/empty-pfp.webp"}
              tabIndex={0}
              onClick={() => previewImage(chosenImageData.url)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  previewImage(chosenImageData.url);
                }
              }}
            />
            <span
              className="text-overflow-support"
              tabIndex={0}
              onClick={() => previewImage(chosenImageData.url)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  previewImage(chosenImageData.url);
                }
              }}
            >
              {chosenImageData.name}
            </span>
          </div>
      }
      
      <button
        style={{right: "0"}}
        onClick={sendMessage}
      >
        <SendSVG />
      </button>

      {
        replyingMessage &&
        <ReplyingMessagePopup
          messagesRef={messagesRef}
          focusMessageInput={focusMessageInput}
          replyingMessage={replyingMessage}
          replyingMessageSenderName={replyingMessageSenderName}
          stopReplying={stopReplying}
        />
      }
    </div>
  )
}