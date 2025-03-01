import { AccountConfirmDelete } from "./Cyber/Account/AccountConfirmDelete"

export function PopUp({ closePopUp, caption, textContent, hasTwoButtons, firstButton, secondButton }) {
  if (caption === "Confirm Account Deletion") {
    return (
      <div id="pop-up" onClick={closePopUp}>
        <div 
          className="main-container"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="caption">{caption}</span>
          <hr className="line" />
          <div className="bottom">
            <span className="text-content">{textContent}</span>
              <AccountConfirmDelete />
          </div>
        </div>
      </div>
    )
  }
 
  return (
    <div id="pop-up" onClick={closePopUp}> 
      <div
        className="main-container" 
        onClick={(e) => e.stopPropagation()}
      >
        <span className="caption">{caption}</span>
        <hr className="line" />
        <div className="bottom">
          <span className="text-content">{textContent}</span>
          <div className="buttons">
            <button
              className="first-button"
              onClick={firstButton.function}
            >
              {firstButton.label}
            </button>
            {
              hasTwoButtons &&
              <button
                className="second-button"
                onClick={secondButton.function}
              >
                {secondButton.label}
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}