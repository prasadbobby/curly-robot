export function Table({ data, className = '' }) {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="empty-state">
        <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10z" />
        </svg>
        <h3 className="empty-state-title">No Data Available</h3>
        <p className="empty-state-subtitle">There's no data to display in table format</p>
      </div>
    )
  }

  const dataArray = Array.isArray(data) ? data : [data]
  const allKeys = new Set()
  
  dataArray.forEach(item => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach(key => allKeys.add(key))
    }
  })

  const keys = Array.from(allKeys)

  if (keys.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="empty-state-title">Invalid Data Structure</h3>
        <p className="empty-state-subtitle">No tabular data structure found</p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table className={`data-table ${className}`}>
        <thead>
          <tr>
            {keys.map(key => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataArray.map((item, index) => (
            <tr key={index}>
              {keys.map(key => (
                <td key={key}>
                  {item[key] === null || item[key] === undefined ? (
                    <span className="table-cell-null">—</span>
                  ) : typeof item[key] === 'object' ? (
                    <code className="table-cell-code">
                      {JSON.stringify(item[key])}
                    </code>
                  ) : (
                    <span>{String(item[key])}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}