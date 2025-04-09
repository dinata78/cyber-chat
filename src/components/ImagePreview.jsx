
export function ImagePreview({ url, width, height, isPreviewFit, setIsPreviewFit, closePreview }) {
  return (
    <div
      id="image-preview"
      onClick={closePreview}
    >
      <div className="extras" onClick={(e) => e.stopPropagation()}>
        <span>
          Actual Size: {width} x {height}
        </span>
        <label>
          <input
            type="checkbox"
            checked={isPreviewFit}
            onChange={() => setIsPreviewFit(prev => !prev)}
          />
          Fit to screen
        </label>
      </div>
      <img
        style={{
          maxWidth: isPreviewFit ? "80vw" : null,
          maxHeight: isPreviewFit ? "80vh" : null
        }}
        src={url}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}