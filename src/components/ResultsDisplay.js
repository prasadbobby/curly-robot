'use client'

import { motion } from 'framer-motion'
import { 
  ArrowDownTrayIcon, 
  ArrowPathIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ChartBarIcon, 
  CodeBracketIcon, 
  TableCellsIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline'
import { Tabs, TabPanel } from './ui/Tabs'
import { Table } from './ui/Table'
import { JsonViewer } from './ui/JsonViewer'
import { ErrorDisplay } from './ui/ErrorDisplay'

export default function ResultsDisplay({ results, onNewRequest }) {
  const downloadData = () => {
    const dataStr = JSON.stringify(results, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `allocation_data_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const renderTable = (data) => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      const hasFilters = results.filter_applied
      const originalCount = results.original_count || 0
      
      return (
        <div className="empty-state">
          <TableCellsIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {hasFilters && originalCount > 0 ? 'No Matching Allocations' : 'No Data Available'}
          </h3>
          <p className="text-gray-500">
            {hasFilters && originalCount > 0 
              ? `Found ${originalCount} allocations for this project, but none match your date range criteria.`
              : 'There\'s no data to display in table format'
            }
          </p>
          {hasFilters && originalCount > 0 && (
            <div className="mt-4">
              <button 
                onClick={onNewRequest} 
                className="btn btn-outline btn-sm"
              >
                Try Different Date Range
              </button>
            </div>
          )}
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
          <InformationCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Invalid Data Structure</h3>
          <p className="text-gray-500">No tabular data structure found</p>
        </div>
      )
    }

    return (
      <div className="table-wrapper">
        <table className="data-table">
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

  const renderSummary = () => {
    if (!results.success || !results.data) {
      return (
        <ErrorDisplay
          title="Cannot Generate Summary"
          message={results.error || 'No data available for analysis'}
        />
      )
    }

    const dataArray = Array.isArray(results.data) ? results.data : [results.data]
    const filteredCount = results.filtered_count || dataArray.length
    const originalCount = results.original_count || dataArray.length
    const filterApplied = results.filter_applied

    return (
      <div className="summary-content">
        <div className="summary-stats">
          <div className="stat-card blue">
            <h4 className="stat-card-title">Filtered Results</h4>
            <div className="stat-card-value">{filteredCount}</div>
            <p className="stat-card-subtitle">Matching allocations</p>
          </div>
          <div className="stat-card green">
            <h4 className="stat-card-title">Total Available</h4>
            <div className="stat-card-value">{originalCount}</div>
            <p className="stat-card-subtitle">All project allocations</p>
          </div>
          <div className="stat-card">
            <h4 className="stat-card-title">Match Rate</h4>
            <div className="stat-card-value">
              {originalCount > 0 ? Math.round((filteredCount / originalCount) * 100) : 0}%
            </div>
            <p className="stat-card-subtitle">Filter effectiveness</p>
          </div>
        </div>

        {filterApplied && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-4">Applied Filters</h4>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Project Code:</span>
                  <div className="mt-1 font-mono text-sm font-semibold">{filterApplied.projectCode}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Start Date:</span>
                  <div className="mt-1 font-mono text-sm font-semibold">{filterApplied.startDate}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">End Date:</span>
                  <div className="mt-1 font-mono text-sm font-semibold">{filterApplied.endDate}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {results.message && (
          <div className={`mt-6 p-4 rounded-lg ${
            filteredCount > 0 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <p className={`text-sm ${
              filteredCount > 0 ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {results.message}
            </p>
          </div>
        )}

        {filteredCount === 0 && originalCount > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-semibold text-blue-900 mb-2">Suggestions:</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Try expanding your date range</li>
              <li>• Check if the project code is correct</li>
              <li>• The project may have allocations outside your selected date range</li>
            </ul>
          </div>
        )}

        {Array.isArray(results.data) && results.data.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-4">Data Overview</h4>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Sample Record Fields:</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.keys(results.data[0] || {}).slice(0, 6).map(key => (
                      <span key={key} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {key}
                      </span>
                    ))}
                    {Object.keys(results.data[0] || {}).length > 6 && (
                      <span className="text-xs text-gray-500">+{Object.keys(results.data[0] || {}).length - 6} more</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Data Quality:</span>
                  <div className="mt-2">
                    <div className="text-sm text-gray-700">
                      {results.data.every(item => item.AllocStartDate && item.AllocEndDate) 
                        ? '✓ All records have complete date information'
                        : '⚠ Some records may have incomplete date information'
                      }
                    </div>
                    <div className="text-sm text-gray-700 mt-1">
                      {results.data.every(item => item.ProjectCode) 
                        ? '✓ All records have project codes'
                        : '⚠ Some records may be missing project codes'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (!results) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="results-container"
    >
      {/* Results Header */}
      <div className="results-header">
        <div className="results-header-content">
          <div>
            <h1 className="results-title">Allocation Results</h1>
            <p className="results-subtitle">
              {results.filter_applied 
                ? `Filtered results for ${results.filter_applied.projectCode} from ${results.filter_applied.startDate} to ${results.filter_applied.endDate}`
                : 'Review your project allocation data and insights'
              }
            </p>
          </div>
          
          <div className={`status-badge ${results.success ? 'status-success' : 'status-error'}`}>
            {results.success ? (
              <>
                <CheckCircleIcon className="w-5 h-5" />
                Success
              </>
            ) : (
              <>
                <XCircleIcon className="w-5 h-5" />
                Failed
              </>
            )}
          </div>
        </div>
      </div>

      {/* Request Parameters */}
      <div className="request-params">
        <h3 className="request-params-title">
          <InformationCircleIcon className="w-5 h-5" />
          Request Information
        </h3>
        <div className="params-grid">
          {/* Show original request parameters */}
          {Object.entries(results.request_payload || {}).map(([key, value]) => (
            <div key={key} className="param-item">
              <div className="param-label">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="param-value">{value}</div>
            </div>
          ))}
          
          {/* Show filtering information if available */}
          {results.filtered_count !== undefined && (
            <>
              <div className="param-item">
                <div className="param-label">Records Found</div>
                <div className="param-value">{results.filtered_count}</div>
              </div>
              <div className="param-item">
                <div className="param-label">Total Available</div>
                <div className="param-value">{results.original_count}</div>
              </div>
              <div className="param-item">
                <div className="param-label">Filter Applied</div>
                <div className="param-value">Date Range</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultTab="table">
        <TabPanel 
          value="table" 
          label="Table View" 
          icon={TableCellsIcon}
        >
          {results.success && results.data ? (
            renderTable(results.data)
          ) : (
            <ErrorDisplay
              title="Request Failed"
              message={results.error || 'No data available'}
              onRetry={onNewRequest}
            />
          )}
        </TabPanel>

        <TabPanel 
          value="json" 
          label="JSON Response" 
          icon={CodeBracketIcon}
        >
          <JsonViewer data={results} />
        </TabPanel>

        <TabPanel 
          value="summary" 
          label="Summary" 
          icon={ChartBarIcon}
        >
          {renderSummary()}
        </TabPanel>
      </Tabs>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button onClick={onNewRequest} className="btn btn-primary">
          <ArrowPathIcon className="w-5 h-5" />
          New Request
        </button>
        <button onClick={downloadData} className="btn btn-secondary">
          <ArrowDownTrayIcon className="w-5 h-5" />
          Download Data
        </button>
      </div>
    </motion.div>
  )
}