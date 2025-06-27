// src/components/ComparisonDisplay.js
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  MinusIcon,
  UserPlusIcon,
  UserMinusIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

export default function ComparisonDisplay({ comparison, onDownload }) {
  const [activeSection, setActiveSection] = useState('summary')

  if (!comparison) {
    return (
      <div className="comparison-empty">
        <ClockIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Previous Data</h3>
        <p className="text-gray-500">This is the first request for this project and date range.</p>
      </div>
    )
  }

  const { summary, details, employeeChanges, activityChanges } = comparison

  const renderTrendIcon = (change) => {
    if (change > 0) return <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
    if (change < 0) return <ArrowTrendingDownIcon className="w-5 h-5 text-red-500" />
    return <MinusIcon className="w-5 h-5 text-gray-400" />
  }

  const renderChangeValue = (change) => {
    const className = change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
    const prefix = change > 0 ? '+' : ''
    return <span className={className}>{prefix}{change}</span>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="comparison-container"
    >
      {/* Header */}
      <div className="comparison-header">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Allocation Comparison
            </h3>
            <p className="text-gray-600">
              Changes since last request • {new Date(comparison.timestamp).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => onDownload(comparison)}
            className="btn btn-secondary"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            Download Report
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="comparison-nav">
        {[
          { key: 'summary', label: 'Summary', icon: ChartBarIcon },
          { key: 'allocations', label: 'Allocations', icon: ClockIcon },
          { key: 'employees', label: 'Employees', icon: UserPlusIcon }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            className={`comparison-nav-btn ${activeSection === tab.key ? 'active' : ''}`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="comparison-content">
        {activeSection === 'summary' && (
          <div className="comparison-summary">
            {/* Overall Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <h4>Total Allocations</h4>
                  {renderTrendIcon(summary.netChange)}
                </div>
                <div className="stat-value">
                  {summary.totalCurrent}
                  <span className="stat-change">
                    {renderChangeValue(summary.netChange)}
                  </span>
                </div>
                <div className="stat-subtitle">
                  {summary.totalPrevious} previously
                </div>
              </div>

              <div className="stat-card green">
                <div className="stat-header">
                  <h4>New Allocations</h4>
                  <UserPlusIcon className="w-5 h-5 text-green-500" />
                </div>
                <div className="stat-value text-green-600">
                  {summary.added}
                </div>
                <div className="stat-subtitle">
                  Recently added
                </div>
              </div>

              <div className="stat-card red">
                <div className="stat-header">
                  <h4>Removed Allocations</h4>
                  <UserMinusIcon className="w-5 h-5 text-red-500" />
                </div>
                <div className="stat-value text-red-600">
                  {summary.removed}
                </div>
                <div className="stat-subtitle">
                  No longer active
                </div>
              </div>

              <div className="stat-card blue">
                <div className="stat-header">
                  <h4>Modified</h4>
                  <ClockIcon className="w-5 h-5 text-blue-500" />
                </div>
                <div className="stat-value text-blue-600">
                  {summary.modified}
                </div>
                <div className="stat-subtitle">
                  Changed details
                </div>
              </div>
            </div>

            {/* Activity Changes */}
            {activityChanges.length > 0 && (
              <div className="activity-changes">
                <h4 className="section-title">Activity Changes</h4>
                <div className="activity-list">
                  {activityChanges.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-name">{activity.activity}</div>
                      <div className="activity-change">
                        <span className="change-before">{activity.before}</span>
                        <span className="change-arrow">→</span>
                        <span className="change-after">{activity.after}</span>
                        <span className={`change-diff ${activity.change > 0 ? 'positive' : 'negative'}`}>
                          ({activity.change > 0 ? '+' : ''}{activity.change})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'allocations' && (
          <div className="comparison-allocations">
            {/* New Allocations */}
            {details.added.length > 0 && (
              <div className="allocation-section">
                <h4 className="section-title text-green-700">
                  <UserPlusIcon className="w-5 h-5" />
                  New Allocations ({details.added.length})
                </h4>
                <div className="allocation-table">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Allocation #</th>
                        <th>Duration</th>
                        <th>Percentage</th>
                        <th>Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.added.map((allocation, index) => (
                        <tr key={index}>
                          <td>
                            <div>
                              <div className="font-semibold">{allocation.EmpName}</div>
                              <div className="text-sm text-gray-500">{allocation.EmpNo}</div>
                            </div>
                          </td>
                          <td>{allocation.AllocNo}</td>
                          <td>
                            <div className="text-sm">
                              {allocation.AllocStartDate} - {allocation.AllocEndDate}
                            </div>
                          </td>
                          <td>{allocation.Percent}%</td>
                          <td>{allocation.ActivityDesc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Removed Allocations */}
            {details.removed.length > 0 && (
              <div className="allocation-section">
                <h4 className="section-title text-red-700">
                  <UserMinusIcon className="w-5 h-5" />
                  Removed Allocations ({details.removed.length})
                </h4>
                <div className="allocation-table">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Allocation #</th>
                        <th>Duration</th>
                        <th>Percentage</th>
                        <th>Activity</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.removed.map((allocation, index) => (
                        <tr key={index}>
                          <td>
                            <div>
                              <div className="font-semibold">{allocation.EmpName}</div>
                              <div className="text-sm text-gray-500">{allocation.EmpNo}</div>
                            </div>
                          </td>
                          <td>{allocation.AllocNo}</td>
                          <td>
                            <div className="text-sm">
                              {allocation.AllocStartDate} - {allocation.AllocEndDate}
                            </div>
                          </td>
                          <td>{allocation.Percent}%</td>
                          <td>{allocation.ActivityDesc}</td>
                          <td>
                            <span className="status-badge status-error">
                              Allocation Expired
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modified Allocations */}
            {details.modified.length > 0 && (
              <div className="allocation-section">
                <h4 className="section-title text-blue-700">
                  <ClockIcon className="w-5 h-5" />
                  Modified Allocations ({details.modified.length})
                </h4>
                <div className="modification-list">
                  {details.modified.map((mod, index) => (
                    <div key={index} className="modification-item">
                      <div className="modification-header">
                        <span className="font-semibold">{mod.current.EmpName}</span>
                        <span className="text-sm text-gray-500">#{mod.current.AllocNo}</span>
                      </div>
                      <div className="modification-changes">
                        {mod.changes.map((change, changeIndex) => (
                          <div key={changeIndex} className="change-item">
                            <span className="change-field">{change.field}:</span>
                            <span className="change-from">{change.from}</span>
                            <span className="change-arrow">→</span>
                            <span className="change-to">{change.to}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'employees' && (
          <div className="comparison-employees">
            {/* Employee Summary */}
            <div className="employee-summary">
              <div className="employee-stat">
                <h5>New Employees</h5>
                <div className="text-2xl font-bold text-green-600">
                  {employeeChanges.added.length}
                </div>
              </div>
              <div className="employee-stat">
                <h5>Removed Employees</h5>
                <div className="text-2xl font-bold text-red-600">
                  {employeeChanges.removed.length}
                </div>
              </div>
              <div className="employee-stat">
                <h5>Employees with Changes</h5>
                <div className="text-2xl font-bold text-blue-600">
                  {employeeChanges.modified.length}
                </div>
              </div>
            </div>

            {/* Employee Details */}
            {(employeeChanges.added.length > 0 || employeeChanges.removed.length > 0) && (
              <div className="employee-details">
                {employeeChanges.added.length > 0 && (
                  <div className="employee-section">
                    <h4 className="section-title text-green-700">New Team Members</h4>
                    <div className="employee-list">
                      {employeeChanges.added.map((emp, index) => (
                        <div key={index} className="employee-card new">
                          <div className="employee-info">
                            <div className="employee-name">{emp.empName}</div>
                            <div className="employee-id">{emp.empNo}</div>
                          </div>
                          <div className="employee-allocations">
                            {emp.allocations} allocation{emp.allocations !== 1 ? 's' : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {employeeChanges.removed.length > 0 && (
                  <div className="employee-section">
                    <h4 className="section-title text-red-700">Team Members No Longer Allocated</h4>
                    <div className="employee-list">
                      {employeeChanges.removed.map((emp, index) => (
                        <div key={index} className="employee-card removed">
                          <div className="employee-info">
                            <div className="employee-name">{emp.empName}</div>
                            <div className="employee-id">{emp.empNo}</div>
                          </div>
                          <div className="employee-allocations">
                            Had {emp.allocations} allocation{emp.allocations !== 1 ? 's' : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}