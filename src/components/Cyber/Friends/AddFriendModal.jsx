import { CloseSVG } from "../../svg/CloseSVG";
import { SearchIconSVG } from "../../svg/SearchIconSVG";

export function AddFriendModal({ setIsAddFriendModalVisible }) {
  return (
    <div id="add-friend-modal" onClick={() => setIsAddFriendModalVisible(false)}>
      <div onClick={(e) => e.stopPropagation()}>
        <div id="add-friend-modal-top">
          <h1>ADD FRIEND</h1>
          <div>
            <button onClick={() => setIsAddFriendModalVisible(false)}>
              <CloseSVG />
            </button>
          </div>
        </div>
        <hr />
        <div id="add-friend-modal-bottom">
          <div id="add-friend-input">
            <div>
              <SearchIconSVG />
            </div>
            <input type="text" placeholder="Search user with their username" />
            <button>Search</button>
          </div>
        </div>
      </div>
    </div>
  )
}