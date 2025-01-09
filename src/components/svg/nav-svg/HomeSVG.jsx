
export function HomeSVG({ currentParameter }) {
  return <svg className={currentParameter === "home" ? "nav-button selected" : "nav-button"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Home</title><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" /></svg>
}