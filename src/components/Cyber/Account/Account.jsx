import { useNavigate } from "react-router-dom";
import { CloseSVG } from "../../svg/CloseSVG";
import { EmailSVG } from "../../svg/EmailSVG"
import { AccountDataCard } from "./AccountDataCard";
import { useState } from "react";
import { logOut, resetPassword, verifyEmail } from "./accountFunctions";
import { useMetadata } from "../../../custom-hooks/useMetadata";
import { auth } from "../../../../firebase";
import { PopUp } from "../../PopUp";
import { AccountConfirmDelete } from "./AccountConfirmDelete";

export function Account({ ownData, setIsAccountVisible }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [caption, setCaption] = useState("");
  const [textContent, setTextContent] = useState("");
  const [modalHasTwoButtons, setModalHasTwoButtons] = useState(false);
  const [firstButton, setFirstButton] = useState({});
  const [secondButton, setSecondButton] = useState({}); 

  const { hiddenUsers } = useMetadata();

  const navigate = useNavigate();

  const executeButton = async (type) => {
    if (type === "log-out") {
      await logOut();
      navigate("/");
    }
    else if (type === "reset-password") {
      try {
        await resetPassword(ownData.email);
        setCaption("Reset Password")
        setTextContent("Password reset link sent. Please check your email.")
        setModalHasTwoButtons(false);
        setFirstButton({
          label: "Okay",
          function: () => setIsModalVisible(false)
        });
        setSecondButton({});
      }
      catch (error) {
        if (error.message === "email-not-verified") {
          setCaption("Account Not Verified");
          setTextContent("Please verify your email before attempting to reset your password.");
          setModalHasTwoButtons(false);
          setFirstButton({
            label: "Okay",
            function: () => setIsModalVisible(false)
          });
          setSecondButton({});
        }
        else {
          setCaption("Reset Password")
          setTextContent("Password reset link not sent. This might be caused by an internal server error. Please try again later.")
          setModalHasTwoButtons(false);
          setFirstButton({
            label: "Okay",
            function: () => setIsModalVisible(false)
          });
          setSecondButton({});
        }
      }
    }
    else if (type === "delete-account") {
      setCaption("Confirm Account Deletion");
      setTextContent("Deleting your account will remove all of your data on Cyber Chat.");
    }
    else if (type === "verify-email") {
      try {
        await verifyEmail();
        setCaption("Verify Email");
        setTextContent("Email verification link sent. Please check your email.");
        setModalHasTwoButtons(false);
        setFirstButton({
          label: "Okay",
          function: () => setIsModalVisible(false)
        });
        setSecondButton({});        
      }
      catch (error) {
        setCaption("Verify Email");
        setTextContent("Email verification link not sent. This might be caused by an internal server error. Please try again later.");
        setModalHasTwoButtons(false);
        setFirstButton({
          label: "Okay",
          function: () => setIsModalVisible(false)
        });
        setSecondButton({});

        if (error.message === "auth/too-many-requests") {
          setTextContent("Too many request at once. Please try again later.")
        }
      }
    }
  }
  const buttonOnClick = (type) => {
    if (type === "log-out") {
      setCaption("Log Out");
      setTextContent("Are you sure you want to log out?");
      setModalHasTwoButtons(true);
      setFirstButton({
        label: "Log out",
        function: () => executeButton("log-out")
      });
      setSecondButton({
        label: "Cancel",
        function: () => setIsModalVisible(false)
      });
    }

    else if (type === "reset-password") {
      setCaption("Reset Password");
      setTextContent("Are you sure you want to reset your password?");
      setModalHasTwoButtons(true);
      setFirstButton({
        label: "Send reset password link",
        function: () => executeButton("reset-password")
      });
      setSecondButton({
        label: "Cancel",
        function: () => setIsModalVisible(false)
      });
    }

    else if (type === "delete-account") {
      setCaption("Delete Account");
      setTextContent("Are you sure you want to delete your account?");
      setModalHasTwoButtons(true);
      setFirstButton({
        label: "Delete account",
        function: () => executeButton("delete-account")
      });
      setSecondButton({
        label: "Cancel",
        function: () => setIsModalVisible(false)
      })
    }

    else if (type === "verify-email") {
      setCaption("Verify Email");
      setTextContent("An email verification link will be sent to your email.");
      setModalHasTwoButtons(true);
      setFirstButton({
        label: "Send link",
        function: () => executeButton("verify-email")
      });
      setSecondButton({
        label: "Cancel",
        function: () => setIsModalVisible(false)
      });
    }

    setIsModalVisible(true);
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
                label="username"
                content={ownData.username}
                ownUid={ownData.uid}
              />
              <AccountDataCard
                label="status"
                content={hiddenUsers.includes(ownData.uid) ? "Hidden" : "Online"}
                ownUid={ownData.uid}
              />
            </div>

            <div className="right">
              <AccountDataCard
                label="display name"
                content={ownData.displayName}
                ownUid={ownData.uid}
              />
              <AccountDataCard
                label="title"
                content={ownData.title}
                ownUid={ownData.uid}
              />
              <AccountDataCard
                label="bio"
                content={ownData.bio}
                ownUid={ownData.uid}
              />
            </div>
          </div>
          <div id="account-email">
            <EmailSVG />
            <span>{ownData.email}</span>
            <span 
              style={{color: auth.currentUser.emailVerified ? "lime" : "red"}}
            >
              {
                auth.currentUser.emailVerified ?
                  "(Verified)"
                : "(Not Verified)"
              }
            </span>
            {
              !auth.currentUser.emailVerified &&
                <button onClick={() => buttonOnClick("verify-email")}>
                  [Verify]
                </button>
            }
          </div>
          <div id="account-buttons">
            <button onClick={() => buttonOnClick("log-out")}>
              Log Out
            </button>

            <button onClick={() => buttonOnClick("reset-password")}>
              Reset Password
            </button>

            <button onClick={() => buttonOnClick("delete-account")}>
              Delete Account
            </button>

          </div>
        </div>

        {
          isModalVisible &&
          <PopUp
            children={<AccountConfirmDelete />}
            closePopUp={() => setIsModalVisible(false)}
            caption={caption}
            textContent={textContent}
            hasTwoButtons={modalHasTwoButtons}
            firstButton={firstButton}
            secondButton={secondButton}
          />
        }
      </div>

    </div>
  )
}