'use client'

import { useState } from 'react'
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

export default function ResultsDisplay({ results, onNewRequest }) {
  const [activeTab, setActiveTab] = useState('table')

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
      return (
        <div className="text-center py-16">
          <TableCellsIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
          <p className="text-gray-500">There's no data to display in table format</p>
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
        <div className="text-center py-16">
          <InformationCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Invalid Data Structure</h3>
          <p className="text-gray-500">No tabular data structure found</p>
        </div>
      )
    }

    return (
      <div className="table-container">
        <table className="table">
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
                      <span className="text-gray-400">—</span>
                    ) : typeof item[key] === 'object' ? (
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
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

  const tabs = [
    { id: 'table', name: 'Table View', icon: TableCellsIcon },
    { id: 'json', name: 'JSON Response', icon: CodeBracketIcon },
    { id: 'summary', name: 'Summary', icon: ChartBarIcon }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Results Header */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Allocation Results</h1>
              <p className="text-gray-600">Review your project allocation data and insights</p>
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
      </div>

      {/* Request Parameters */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <InformationCircleIcon className="w-5 h-5" />
            Request Parameters
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(results.request_payload || {}).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-4">
                <dt className="text-sm font-semibold text-gray-600 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </dt>
                <dd className="font-mono text-sm font-semibold text-gray-900">
                  {value}
                </dd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 border-b-2 font-semibold text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="min-h-96">
          {activeTab === 'table' && (
            <div className="p-6">
              {results.success && results.data ? (
                renderTable(results.data)
              ) : (
                <div className="text-center py-16">
                  <XCircleIcon className="w-16 h-16 text-red-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
                  <p className="text-red-700">{results.error || 'No data available'}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'json' && (
            <div className="p-6">
              <div className="bg-gray-900 rounded-lg p-6 overflow-auto max-h-96">
                <pre className="text-green-400 text-sm">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="p-6">
              {results.success && results.data ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6 text-center">
                    <h4 className="font-semibold text-blue-900 mb-2">Total Records</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {Array.isArray(results.data) ? results.data.length : 1}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6 text-center">
                    <h4 className="font-semibold text-green-900 mb-2">Status Code</h4>
                    <p className="text-2xl font-bold text-green-600">{results.status_code}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6 text-center">
                    <h4 className="font-semibold text-purple-900 mb-2">Response Time</h4>
                    <p className="text-sm font-semibold text-purple-600">
                      {results.timestamp ? new Date(results.timestamp).toLocaleTimeString() : 'N/A'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <XCircleIcon className="w-16 h-16 text-red-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Cannot Generate Summary</h3>
                  <p className="text-red-700">{results.error || 'No data available for analysis'}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
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