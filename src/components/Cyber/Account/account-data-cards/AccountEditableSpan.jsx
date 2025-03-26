
export function AccountEditableSpan({ contentRef, isEditMode, errorInfo, content, editedContent, inputContent }) {
  return (
    <span
      ref={contentRef}
      contentEditable={isEditMode}
      suppressContentEditableWarning
      className="content editable-span overflow-y-support"
      style={{
        borderBottomWidth: isEditMode ? "1px" : null,
        borderBottomStyle: isEditMode ? "solid" : null,
        borderBottomColor: isEditMode && errorInfo.length ? "red" : "white"
      }}
      onInput={inputContent}
    >
      {isEditMode ? editedContent : content || "(Not Set)"}
    </span>
  )
}