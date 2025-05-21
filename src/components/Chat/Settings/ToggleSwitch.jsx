
export function ToggleSwitch({ toggleState, toggleFunction }) {
  return (
    <button
      className="toggle-switch"
      style={{
        justifyContent: toggleState ? "flex-end" : "flex-start",
      }}
      onClick={toggleFunction}
    >
      <div style={{backgroundColor: toggleState ? "lime" : "#aa0000"}}>
        
      </div>
    </button>
  )
}