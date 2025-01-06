import { useState } from "react"

export function InputTypeToggle({ onClick }) {
  const [toggleState, setToggleState] = useState(false);

  return (
    <div 
      className={
        toggleState ? "input-type-toggle toggle-on" 
        : "input-type-toggle"
        }
      onClick={
        () => {
          setToggleState(!toggleState);
          onClick();
        } 
      }
    >
      <div></div>
    </div>
  )
}