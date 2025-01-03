
export function LoadingOverlay({ isLoading }) {
  if (!isLoading) return null;
  
  return (
    <div id="loading-overlay">
      <div id="loading-spinner"></div>
    </div>
  )
}