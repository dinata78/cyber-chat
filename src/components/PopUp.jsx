
export function PopUp({ children, closePopUp, caption, textContent, hasTwoButtons, firstButton, secondButton }) {
  if (caption === "Confirm Account Deletion") {
    return (
      <div id="pop-up" onClick={closePopUp}>
        <div onClick={(e) => e.stopPropagation()}>
          <h1>{caption}</h1>
          <hr />
          <div className="bottom">
            <span>{textContent}</span>
            {children}
          </div>
        </div>
      </div>
    )
  }
 
  return (
    <div id="pop-up" onClick={closePopUp}> 
      <div onClick={(e) => e.stopPropagation()}>
        <h1>{caption}</h1>
        <hr />
        <div className="bottom">
          <span>{textContent}</span>
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