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

export default function ResultsDisplay({ results, onNewRequest, onViewComparison }) {
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
        <div className="empty-state-icon-wrapper">
          <TableCellsIcon className="empty-state-icon" />
        </div>
        <h3 className="empty-state-title">
          {hasFilters && originalCount > 0 ? 'No Matching Allocations' : 'No Data Available'}
        </h3>
        <p className="empty-state-subtitle">
          {hasFilters && originalCount > 0 
            ? `Found ${originalCount} allocations for this project, but none match your date range criteria.`
            : 'There\'s no data to display in table format'
          }
        </p>
        {hasFilters && originalCount > 0 && (
          <div className="empty-state-actions">
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
      
      {/* Comparison Indicator */}
      {results.comparison_available && results.comparison_summary && (
        <div className="comparison-indicator mt-4">
          <div className="flex items-center gap-3 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-xl border border-blue-200">
            <div className="comparison-icon">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="comparison-content flex-1">
              <div className="comparison-title text-blue-800 font-semibold">
                📊 Comparison Available
              </div>
              <div className="comparison-details text-blue-700">
                <span className="mr-4">
                  <strong>Net Change:</strong> 
                  <span className={`ml-1 font-bold ${
                    results.comparison_summary.net_change > 0 
                      ? 'text-green-600' 
                      : results.comparison_summary.net_change < 0 
                        ? 'text-red-600' 
                        : 'text-gray-600'
                  }`}>
                    {results.comparison_summary.net_change > 0 ? '+' : ''}{results.comparison_summary.net_change} allocations
                  </span>
                </span>
                <span className="mr-4">
                  <strong>Changes:</strong> 
                  <span className="ml-1 font-bold text-purple-600">
                    {results.comparison_summary.changes_detected} detected
                  </span>
                </span>
                <span className="text-xs text-blue-600">
                  vs. {new Date(results.comparison_summary.previous_timestamp).toLocaleDateString()} request
                </span>
              </div>
            </div>
            <div className="comparison-action">
              <button
                onClick={onViewComparison} // FIXED: Use prop instead of setDashboardView
                className="btn-mini bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                View Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No Comparison Available Message */}
      {!results.comparison_available && results.success && (
        <div className="no-comparison-indicator mt-4">
          <div className="flex items-center gap-3 text-sm bg-gradient-to-r from-gray-50 to-slate-50 px-4 py-3 rounded-xl border border-gray-200">
            <div className="no-comparison-icon">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="no-comparison-content">
              <span className="text-gray-600">
                🆕 <strong>First Request:</strong> No previous data found for comparison. 
                Future requests with the same criteria will show change analysis.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
    
    <div className="results-header-actions">
      {/* Status Badge */}
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

      {/* Quick Stats */}
      {results.success && results.filtered_count !== undefined && (
        <div className="quick-stats">
          <div className="stat-item">
            <div className="stat-value">{results.filtered_count}</div>
            <div className="stat-label">Results</div>
          </div>
          {results.original_count !== results.filtered_count && (
            <div className="stat-item">
              <div className="stat-value">{results.original_count}</div>
              <div className="stat-label">Total</div>
            </div>
          )}
          {results.comparison_summary && (
            <div className="stat-item comparison-stat">
              <div className={`stat-value ${
                results.comparison_summary.net_change > 0 
                  ? 'text-green-600' 
                  : results.comparison_summary.net_change < 0 
                    ? 'text-red-600' 
                    : 'text-gray-600'
              }`}>
                {results.comparison_summary.net_change > 0 ? '+' : ''}{results.comparison_summary.net_change}
              </div>
              <div className="stat-label">Change</div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>

  {/* Results Summary Bar */}
  {results.success && (
    <div className="results-summary-bar">
      <div className="summary-items">
        <div className="summary-item">
          <span className="summary-label">Project:</span>
          <span className="summary-value">{results.filter_applied?.projectCode || 'N/A'}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Period:</span>
          <span className="summary-value">
            {results.filter_applied 
              ? `${results.filter_applied.startDate} → ${results.filter_applied.endDate}`
              : 'Custom Range'
            }
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Retrieved:</span>
          <span className="summary-value">{new Date().toLocaleString()}</span>
        </div>
        {results.comparison_summary && (
          <div className="summary-item comparison-summary">
            <span className="summary-label">Comparison:</span>
            <span className="summary-value">
              {results.comparison_summary.changes_detected === 0 
                ? '✓ No changes detected'
                : `⚡ ${results.comparison_summary.changes_detected} changes found`
              }
            </span>
          </div>
        )}
      </div>
    </div>
  )}
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