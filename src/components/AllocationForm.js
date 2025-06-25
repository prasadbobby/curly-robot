'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarIcon, FolderIcon, MagnifyingGlassIcon, ClockIcon } from '@heroicons/react/24/outline'
import DatePicker from './DatePicker'

export default function AllocationForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    projectCode: 'FD25DCCM',
    allocStartDate: '01 May 2025',
    allocEndDate: '31 Jul 2025'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

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
          <h2 className="card-title">Create Allocation Request</h2>
          <p className="card-subtitle">
            Enter your project details to fetch comprehensive allocation data
          </p>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-8">
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

            {/* Summary */}
            <div className="summary-card">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MagnifyingGlassIcon className="w-5 h-5" />
                Request Summary
              </h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <div className="summary-icon">
                    <FolderIcon className="w-6 h-6" />
                  </div>
                  <div className="summary-label">Project</div>
                  <div className="summary-value">{formData.projectCode || 'Not specified'}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-icon">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <div className="summary-label">Start Date</div>
                  <div className="summary-value">{formData.allocStartDate || 'Not selected'}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-icon">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <div className="summary-label">End Date</div>
                  <div className="summary-value">{formData.allocEndDate || 'Not selected'}</div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={!formData.projectCode || !formData.allocStartDate || !formData.allocEndDate || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner" style={{ width: '1rem', height: '1rem', margin: 0 }} />
                    Processing...
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="w-5 h-5" />
                    Execute Allocation Request
                  </>
                )}
              </button>
              <p className="form-help mt-4">
                This will fetch comprehensive allocation data for your specified project and date range
              </p>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  )
}