import { useEffect, useState } from "react";
import { AccountNavSVG, CloseSVG, PrivacyNavSVG, ProfileNavSVG } from "../../svg";
import { ProfilePicture } from "./ProfilePicture";
import { Username } from "./Username";
import { DisplayName } from "./DisplayName";
import { Bio } from "./Bio";
import { StatusVisibility } from "./StatusVisibility";
import { Email } from "./Email";
import { SignOut } from "./SignOut";
import { PasswordReset } from "./PasswordReset";
import { AccountRemoval } from "./AccountRemoval";
import { UID } from "./UID";
import { addModalToStack, getTopModalFromStack, removeModalFromStack } from "../../modalStack";

export function Settings({ ownData, ownStatus, closeSettings }) {
  const [ currentNav, setCurrentNav ] = useState("profile");

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (getTopModalFromStack() === "settings") {
          closeSettings();
          removeModalFromStack("settings");
        }
      }
    }
     
    addModalToStack("settings");
    document.addEventListener("keydown", handleEscape);

    return () => {
      removeModalFromStack("settings");
      document.removeEventListener("keydown", handleEscape);
    }
  }, []);

  return (
    <div id="chat-settings" onClick={closeSettings}>
      <div
        className="container"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div id="settings-top">
          <h1>Settings</h1>
          <button onClick={closeSettings}>
            <CloseSVG />
          </button>
        </div>

        <nav id="settings-nav">

          <button
            className={currentNav === "profile" ? "selected" : null}
            onClick={() => setCurrentNav("profile")}
          >
            <ProfileNavSVG />
            Profile
          </button>

          <button
            className={currentNav === "account" ? "selected" : null}
            onClick={() => setCurrentNav("account")}
          >
            <AccountNavSVG />
            Account
          </button>

          <button
            className={currentNav === "privacy" ? "selected" : null}
            onClick={() => setCurrentNav("privacy")}
          >
            <PrivacyNavSVG />
            Privacy
          </button>

        </nav>
        
        <div id="settings-bottom" className="overflow-y-support">

          {
            currentNav === "profile" ?
              <>

                <ProfilePicture
                  ownUid={ownData.uid}
                  ownPfpUrl={ownData.pfpUrl}
                />

                <hr />

                <Username
                  ownUid={ownData.uid}
                  ownUsername={ownData.username}
                />

                <hr />

                <DisplayName
                  ownUid={ownData.uid}
                  ownDisplayName={ownData.displayName}
                />

                <hr />

                <Bio
                  ownUid={ownData.uid}
                  ownBio={ownData.bio}
                />

                <hr />
              </>

            : currentNav === "account" ?
              <>
                <UID ownUid={ownData.uid} />

                <hr />

                <Email />

                <hr />

                <SignOut />

                <hr />

                <PasswordReset />

                <hr />

                <AccountRemoval />

                <hr />
              </>
              
            : <>
                <StatusVisibility
                  ownUid={ownData.uid}
                  ownStatus={ownStatus}
                />
                <hr />
              </>
          }

        </div>

      </div>

    </div>
  )
}