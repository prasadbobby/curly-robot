'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CalendarIcon, FolderIcon, MagnifyingGlassIcon, ClockIcon, UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import DatePicker from './DatePicker'
import { credentialsManager } from '@/utils/credentials'

export default function AllocationForm({ onSubmit, error }) {
  const [formData, setFormData] = useState({
    projectCode: 'FD25DCCM',
    allocStartDate: '01 May 2025',
    allocEndDate: '31 Jul 2025',
    username: '',
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [hasStoredCredentials, setHasStoredCredentials] = useState(false)
useEffect(() => {
  // Always check fresh credentials from storage
  const storedCredentials = credentialsManager.get()
  if (storedCredentials) {
    console.log('✓ Found valid stored credentials for:', storedCredentials.username)
    setHasStoredCredentials(true)
    setFormData(prev => ({
      ...prev,
      username: storedCredentials.username,
      password: storedCredentials.password
    }))
  } else {
    console.log('✗ No stored credentials - showing authentication form')
    setHasStoredCredentials(false)
    setFormData(prev => ({
      ...prev,
      username: '',
      password: ''
    }))
  }
}, []) // Only run on component mount/remount (key change forces remount)
// Add a separate effect to handle credential clearing
useEffect(() => {
  if (error && error.includes('Authentication failed')) {
    console.log('Authentication failed - clearing form credentials')
    setHasStoredCredentials(false)
    setFormData(prev => ({
      ...prev,
      username: '',
      password: ''
    }))
  }
}, [error])
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDateChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  setIsSubmitting(true)
  
  try {
    // DON'T store credentials here - let the parent handle success/failure
    await onSubmit(formData)
  } finally {
    setIsSubmitting(false)
  }
}

  const setQuickDate = (field, type) => {
    const now = new Date()
    let date

    if (type === 'currentMonth') {
      date = new Date(now.getFullYear(), now.getMonth(), 1)
    } else if (type === 'nextMonth') {
      date = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    } else if (type === 'endOfMonth') {
      date = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    } else if (type === 'endOfQuarter') {
      const quarter = Math.floor(now.getMonth() / 3)
      date = new Date(now.getFullYear(), (quarter + 1) * 3, 0)
    }

    const formattedDate = formatDate(date)
    handleDateChange(field, formattedDate)
  }

  const formatDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const day = date.getDate().toString().padStart(2, '0')
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Project Allocation Request</h2>
          <p className="card-subtitle">
            Enter your details to fetch comprehensive allocation data
          </p>
        </div>

        <div className="card-body">
          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="error-alert"
            >
              <div className="error-alert-icon">
                <ExclamationTriangleIcon className="w-5 h-5" />
              </div>
              <div className="error-alert-content">
                <h4 className="error-alert-title">Request Failed</h4>
                <p className="error-alert-message">{error}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Credentials Section - Only show if not stored */}
            {!hasStoredCredentials && (
              <div className="credentials-section">
                <div className="section-header-auth">
                  <div className="auth-icon">
                    <ShieldCheckIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="auth-title">Authentication Required</h3>
                    <p className="auth-subtitle">Secure access to allocation data</p>
                  </div>
                </div>
                
                <div className="auth-form-grid">
                  <div className="auth-input-group">
                    <label className="auth-label">Username</label>
                    <div className="auth-input-wrapper">
                      <UserIcon className="auth-input-icon" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="auth-input"
                        placeholder="Enter your username"
                        required
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  <div className="auth-input-group">
                    <label className="auth-label">Password</label>
                    <div className="auth-input-wrapper">
                      <LockClosedIcon className="auth-input-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="auth-input"
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="password-toggle-btn"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="auth-notice">
                  <div className="auth-notice-icon">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span>Credentials will be securely stored for this session only</span>
                </div>
              </div>
            )}

            {/* Authenticated Status */}
            {hasStoredCredentials && (
              <div className="auth-status">
                <div className="auth-status-content">
                  <div className="auth-status-icon">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="auth-status-text">
                    <h4>Authenticated Session Active</h4>
                    <p>Signed in as <strong>{formData.username}</strong></p>
                  </div>
                </div>
                <div className="auth-status-badge">
                  <span>Secure</span>
                </div>
              </div>
            )}

            {/* Project Information */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon">
                  <FolderIcon className="w-5 h-5" />
                </div>
                <h3 className="section-title">Project Information</h3>
              </div>
              
              <div className="form-group">
                <label className="form-label">Project Code</label>
                <input
                  type="text"
                  name="projectCode"
                  value={formData.projectCode}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., FD25DCCM"
                  required
                />
                <p className="form-help">Enter the unique identifier for your project</p>
              </div>
            </div>

            {/* Date Range */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <h3 className="section-title">Allocation Period</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <DatePicker
                    value={formData.allocStartDate}
                    onChange={(value) => handleDateChange('allocStartDate', value)}
                    placeholder="Select start date"
                  />
                  <div className="quick-actions">
                    <button
                      type="button"
                      onClick={() => setQuickDate('allocStartDate', 'currentMonth')}
                      className="btn btn-outline btn-sm"
                    >
                      <ClockIcon className="w-3 h-3" />
                      Current Month
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate('allocStartDate', 'nextMonth')}
                      className="btn btn-outline btn-sm"
                    >
                      <ClockIcon className="w-3 h-3" />
                      Next Month
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <DatePicker
                    value={formData.allocEndDate}
                    onChange={(value) => handleDateChange('allocEndDate', value)}
                    placeholder="Select end date"
                  />
                  <div className="quick-actions">
                    <button
                      type="button"
                      onClick={() => setQuickDate('allocEndDate', 'endOfMonth')}
                      className="btn btn-outline btn-sm"
                    >
                      <ClockIcon className="w-3 h-3" />
                      End of Month
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate('allocEndDate', 'endOfQuarter')}
                      className="btn btn-outline btn-sm"
                    >
                      <ClockIcon className="w-3 h-3" />
                      End of Quarter
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Summary */}
            <div className="request-summary">
              <div className="summary-header">
                <MagnifyingGlassIcon className="w-5 h-5" />
                <h3>Request Summary</h3>
              </div>
              <div className="summary-grid">
                <div className="summary-item">
                  <div className="summary-label">User</div>
                  <div className="summary-value">{formData.username || 'Not provided'}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Project</div>
                  <div className="summary-value">{formData.projectCode || 'Not specified'}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Date Range</div>
                  <div className="summary-value">
                    {formData.allocStartDate && formData.allocEndDate 
                      ? `${formData.allocStartDate} to ${formData.allocEndDate}`
                      : 'Not selected'
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="submit-section">
              <button
                type="submit"
                className="submit-btn"
                disabled={
                  !formData.projectCode || 
                  !formData.allocStartDate || 
                  !formData.allocEndDate || 
                  (!hasStoredCredentials && (!formData.username || !formData.password)) ||
                  isSubmitting
                }
              >
                {isSubmitting ? (
                  <>
                    <div className="btn-spinner" />
                    <span>Processing Request...</span>
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="w-5 h-5" />
                    <span>Execute Allocation Request</span>
                  </>
                )}
              </button>
              <p className="submit-help">
                This will fetch comprehensive allocation data for your specified criteria
              </p>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  )
}