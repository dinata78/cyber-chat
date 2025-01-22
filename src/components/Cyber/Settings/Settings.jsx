import { InputTypeToggle } from "./InputTypeToggle";

export function Settings({ ownData }) {
  const onContrastToggle = () => {
    console.log("Contrast Mode Toggled.");
  }

  return (
    <div id="cyber-settings">
      <h1>Settings</h1>
      <div id="cyber-settings-features">
        <div className="settings-feature">
          <span>Font Size</span>
          <select>
            <option>Small</option>
            <option>Normal</option>
            <option>Large</option>
          </select>
        </div>
        <div className="settings-feature">
          <span>Contrast Mode</span>
          <InputTypeToggle onClick={onContrastToggle}/>
        </div>
      </div>
    </div>
  )
}