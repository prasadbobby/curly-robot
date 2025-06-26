export function JsonViewer({ data, className = '' }) {
  return (
    <div className={`json-viewer ${className}`}>
      <div className="json-container">
        <pre className="json-content">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  )
}