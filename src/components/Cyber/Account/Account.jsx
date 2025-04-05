import { auth } from "../../../../firebase";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CloseSVG } from "../../svg/CloseSVG";
import { EmailSVG } from "../../svg/EmailSVG"
import { logOut, resetPassword, verifyEmail } from "./accountFunctions";
import { PopUp } from "../../PopUp";
import { AccountUsername } from "./account-data-cards/AccountUsername";
import { AccountStatus } from "./account-data-cards/AccountStatus";
import { AccountDisplayName } from "./account-data-cards/AccountDisplayName";
import { AccountTitle } from "./account-data-cards/AccountTitle";
import { AccountBio } from "./account-data-cards/AccountBio";
import { useStatusByUid } from "../../../custom-hooks/useStatusByUid";
import { AccountPfp } from "./account-data-cards/AccountPfp";

export function Account({ ownData, setIsAccountVisible }) {
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [popUpData, setPopUpData] = useState({caption: "", textContent: "", hasTwoButtons: false, firstButton: {}, secondButton: {}});

  const { status } = useStatusByUid(ownData.uid);
  const accountContainerRef = useRef(null);

  const navigate = useNavigate();

  const executeButton = async (type) => {
    if (type === "log-out") {
      await logOut();
      navigate("/");
    }
    else if (type === "reset-password") {
      try {
        await resetPassword(ownData.email);

        setPopUpData((prev) => {
          return {
            ...prev,
            caption: "Reset Password",
            textContent: "Password reset link sent. Please check your email.",
            hasTwoButtons: false,
            firstButton: {label: "Okay", function: () => setIsPopUpVisible(false)},
            secondButton: {}
          }
        });
      }
      catch (error) {
        if (error.message === "email-not-verified") {
          setPopUpData((prev) => {
            return {
              ...prev,
              caption: "Account Not Verified",
              textContent: "Please verify your email before attempting to reset your password.",
              hasTwoButtons: false,
              firstButton: {label: "Okay", function: () => setIsPopUpVisible(false)},
              secondButton: {}
            }
          });
        }
        else {
          setPopUpData((prev) => {
            return {
              ...prev,
              caption: "Reset Password",
              textContent: "Password reset link not sent. This might be caused by an internal server error. Please try again later.",
              hasTwoButtons: false,
              firstButton: {label: "Okay", function: () => setIsPopUpVisible(false)},
              secondButton: {}
            }
          });
        }
      }
    }
    else if (type === "delete-account") {
      setPopUpData((prev) => {
        return {
          ...prev,
          caption: "Confirm Account Deletion",
          textContent: "Deleting your account will remove all of your data on Cyber Chat.",
        }
      });
    }
    else if (type === "verify-email") {
      try {
        await verifyEmail();   
        
        setPopUpData((prev) => {
          return {
            ...prev,
            caption: "Verify Email",
            textContent: "Email verification link sent. Please check your email.",
            hasTwoButtons: false,
            firstButton: {label: "Okay", function: () => setIsPopUpVisible(false)},
            secondButton: {}
          }
        });
      }
      catch (error) {
        setPopUpData((prev) => {
          return {
            ...prev,
            caption: "Verify Email",
            textContent: "Email verification link not sent. This might be caused by an internal server error. Please try again later.",
            hasTwoButtons: false,
            firstButton: {label: "Okay", function: () => setIsPopUpVisible(false)},
            secondButton: {}
          }
        });

        if (error.message === "auth/too-many-requests") {
          setPopUpData((prev) => {
            return {
              ...prev,
              textContent: "Too many request at once. Please try again later.",
            }
          });
        }
      }
    }
  }
  const buttonOnClick = (type) => {
    if (type === "log-out") {
      setPopUpData((prev) => {
        return {
          ...prev,
          caption: "Log Out",
          textContent: "Are you sure you want to log out?",
          hasTwoButtons: true,
          firstButton: {label: "Log out", function: () => executeButton("log-out")},
          secondButton: {label: "Cancel", function: () => setIsPopUpVisible(false)}
        }
      });
    }
    else if (type === "reset-password") {
      setPopUpData((prev) => {
        return {
          ...prev,
          caption: "Reset Password",
          textContent: "Are you sure you want to reset your password?",
          hasTwoButtons: true,
          firstButton: {label: "Send reset password link", function: () => executeButton("reset-password")},
          secondButton: {label: "Cancel", function: () => setIsPopUpVisible(false)}
        }
      });
    }
    else if (type === "delete-account") {
      setPopUpData((prev) => {
        return {
          ...prev,
          caption: "Delete Account",
          textContent: "Are you sure you want to delete your account?",
          hasTwoButtons: true,
          firstButton: {label: "Delete account", function: () => executeButton("delete-account")},
          secondButton: {label: "Cancel", function: () => setIsPopUpVisible(false)}
        }
      });
    }
    else if (type === "verify-email") {
      setPopUpData((prev) => {
        return {
          ...prev,
          caption: "Verify Email",
          textContent: "An email verification link will be sent to your email.",
          hasTwoButtons: true,
          firstButton: {label: "Send link", function: () => executeButton("verify-email")},
          secondButton: {label: "Cancel", function: () => setIsPopUpVisible(false)}
        }
      });
    }

    setIsPopUpVisible(true);
  }

  useEffect(() => {
    const handleInput = (e) => {
      if (e.target.matches(".editable-span")) {
        if (!e.target.innerText.trim()) {
          e.target.innerText = "";
        }
      }
    }

    if (accountContainerRef.current) {
      accountContainerRef.current.addEventListener("input", handleInput);
    }

    return () => {
      if (accountContainerRef.current) {
        accountContainerRef.current.removeEventListener("input", handleInput);
      }
    }
  }, []);

  return (
    <div id="cyber-account" onClick={() => setIsAccountVisible(false)}
    >
      <div ref={accountContainerRef} onClick={(e) => e.stopPropagation()}>
        
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
              <AccountPfp
                pfpUrl={ownData.pfpUrl}
                ownUid={ownData.uid}
              />
              <AccountUsername
                username={ownData.username}
                ownUid={ownData.uid}
              />
              <AccountStatus
                status={status}
                ownUid={ownData.uid}
              />
            </div>
            <div className="right">
              <AccountDisplayName
                displayName={ownData.displayName}
                ownUid={ownData.uid}
              />
              <AccountTitle
                title={ownData.title}
                ownUid={ownData.uid}
              />
              <AccountBio
                bio={ownData.bio}
                ownUid={ownData.uid}
              />
            </div>
          </div>

          <div id="account-email">
            <EmailSVG />
            <span>{ownData.email}</span>
            <span 
              style={{color: auth.currentUser?.emailVerified ? "lime" : "red"}}
            >
              {
                auth.currentUser?.emailVerified ? 
                  "(Verified)"
                : "(Not Verified)"
              }
            </span>
            {
              !auth.currentUser?.emailVerified &&
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
          isPopUpVisible &&
          <PopUp
            closePopUp={() => setIsPopUpVisible(false)}
            caption={popUpData.caption}
            textContent={popUpData.textContent}
            hasTwoButtons={popUpData.hasTwoButtons}
            firstButton={popUpData.firstButton}
            secondButton={popUpData.secondButton}
          />
        }
      </div>

    </div>
  )
}