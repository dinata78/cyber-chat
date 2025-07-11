import { useState } from "react"

export function previewAccount() {

}

export function AccountPreview() {
  const [ a, b ] = useState(true) 

  if (!a) return null;

  return (
    <div id="account-preview">
      <div className="container">

        <div className="header">
          <img src="/empty-pfp.webp" />
        </div>

        <main>
          <div className="cell">
            <span
              className="text-overflow-support"
              style={{
                maxWidth: "90%",
                marginTop: "32px"
              }}
            >
              Steven Dinata
            </span>
            <span
              className="text-overflow-support"
              style={{
                maxWidth: "90%",
                color: "#ccd",
                fontSize: "14px"
              }}
            >
              @stevendinata
            </span>
            <span
              className="text-overflow-support"
              style={{
                maxWidth: "90%",
                marginTop: "auto",
                marginBottom: "8px",
                color: "#ccd",
                fontSize: "12px"
              }}
            >
              ID: {import.meta.env.VITE_DEV_UID}
            </span>
            <hr />
            <button>
              Edit Profile
            </button>
          </div>
          <div className="cell">
            <span
              style={{
                marginTop: "12px",
                fontSize: "12px"
              }}
            >
              ABOUT ME
            </span>
            <span className="about-me overflow-y-support">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit hic distinctio pariatur eligendi, voluptatem quam voluptatibus ducimus ad alias eveniet cupiditate a quos aperiam laborum!
            </span>
          </div>
        </main>

      </div>
    </div>
  )
}