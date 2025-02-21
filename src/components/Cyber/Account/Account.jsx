import { useNavigate } from "react-router-dom";
import { CloseSVG } from "../../svg/CloseSVG";
import { EmailSVG } from "../../svg/EmailSVG"
import { AccountDataCard } from "./AccountDataCard";
import { useState } from "react";
import { AccountModal } from "./AccountModal";
import { deleteAccount, logOut, resetPassword } from "./accountFunctions";

export function Account({ ownData, setIsAccountVisible }) {
  const [ modalType, setModalType ] = useState("");
  const [ isModalVisible, setIsModalVisible ] = useState(false);

  const navigate = useNavigate();

  const buttonOnClick = (type) => {
    setModalType(type);
    setIsModalVisible(true);
  }

  const executeButton = async (type) => {
    if (type === "log-out") {
      await logOut();
      navigate("/");
    }
    else if (type === "reset-password") {
      resetPassword(ownData.email, setModalType);
    }
    else if (type === "delete-account") {
      setModalType("delete-account-confirmation");
    }
    else {
      return null;
    }
  }
  
  return (
    <div
      id="cyber-account"
      onClick={() => setIsAccountVisible(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
      >
        
        <div id="cyber-account-top">
          <h1>Account</h1>
          <div>
            <button
              onClick={() => setIsAccountVisible(false)}
            >
              <CloseSVG />
            </button>
          </div>
        </div>

        <hr />
        
        <div id="cyber-account-bottom">
          <div id="account-data">
            <div className="left">
              <img src="/empty-pfp.webp" />
              <AccountDataCard
                label="USERNAME"
                content={ownData.username}
                ownUid={ownData.uid}
              />
              <AccountDataCard
                label="STATUS"
                content="Online"
                ownUid={ownData.uid}
              />
            </div>

            <div className="right">
              <AccountDataCard
                label="DISPLAY NAME"
                content={ownData.name}
                ownUid={ownData.uid}
              />
              <AccountDataCard
                label="TITLE"
                content={ownData.title}
                ownUid={ownData.uid}
              />
              <AccountDataCard
                label="BIO"
                content={ownData.bio}
                ownUid={ownData.uid}
              />
            </div>
          </div>
          <div id="account-email">
            <EmailSVG />
            <span id="email">{ownData.email}</span>
          </div>
          <div id="account-buttons">
            <button
              onClick={() => buttonOnClick("log-out")}
            >
              Log Out
            </button>

            <button
              onClick={() => buttonOnClick("reset-password")}
            >
              Reset Password
            </button>

            <button
              onClick={() => buttonOnClick("delete-account")}
            >
              Delete Account
            </button>

          </div>
        </div>

        {
          isModalVisible &&
            <AccountModal
              type={modalType}
              executeButton={executeButton}
              closeModal={() => setIsModalVisible(false)}
            />
        }
      </div>

    </div>
  )
}