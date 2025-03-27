
export function AccountEditableSpan({ contentRef, isEditMode, errorInfo, content, editedContent, inputContent, updateContent }) {
  return (
    <span
      ref={contentRef}
      contentEditable={isEditMode}
      suppressContentEditableWarning
      className="content editable-span overflow-y-support"
      style={{
        backgroundColor: isEditMode && errorInfo.length ? "#ff000035" : isEditMode ? "#aaddff50" : null,
        borderBottomWidth: isEditMode ? "1px" : null,
        borderBottomStyle: isEditMode ? "solid" : null,
        borderBottomColor: isEditMode && errorInfo.length ? "red" : isEditMode ? "white" : null
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          updateContent(editedContent);
        }
      }}
      onInput={inputContent}
    >
      {isEditMode ? editedContent : content || "(Not Set)"}
    </span>
  )
}