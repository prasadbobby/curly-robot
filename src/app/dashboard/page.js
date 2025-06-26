'use client'

import { useState } from 'react'
import Layout from '@/components/Layout/Layout'
import AllocationForm from '@/components/AllocationForm'
import ResultsDisplay from '@/components/ResultsDisplay'
import ErrorNotification from '@/components/ErrorNotification'
import LoadingSpinner from '@/components/LoadingSpinner'
import { credentialsManager } from '@/utils/credentials'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState([])
  const [dashboardView, setDashboardView] = useState('request')
  const [formKey, setFormKey] = useState(0) // Force form re-render

  // Normalize date string for comparison
  const normalizeDate = (dateStr) => {
    if (!dateStr) return null
    
    try {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      
      const parts = dateStr.trim().split(/\s+/)
      if (parts.length !== 3) return null
      
      const day = parts[0].padStart(2, '0')
      const month = parts[1]
      const year = parts[2]
      
      if (!months.includes(month)) return null
      
      return `${day} ${month} ${year}`
    } catch (error) {
      console.error('Error normalizing date:', dateStr, error)
      return null
    }
  }

  const matchesAllCriteria = (allocation, searchCriteria) => {
    const allocProjectCode = (allocation.ProjectCode || '').trim().toUpperCase()
    const searchProjectCode = (searchCriteria.projectCode || '').trim().toUpperCase()
    
    if (allocProjectCode !== searchProjectCode) {
      return false
    }
    
    const allocStartDate = normalizeDate(allocation.AllocStartDate)
    const searchStartDate = normalizeDate(searchCriteria.allocStartDate)
    
    if (!allocStartDate || !searchStartDate || allocStartDate !== searchStartDate) {
      return false
    }
    
    const allocEndDate = normalizeDate(allocation.AllocEndDate)
    const searchEndDate = normalizeDate(searchCriteria.allocEndDate)
    
    if (!allocEndDate || !searchEndDate || allocEndDate !== searchEndDate) {
      return false
    }
    
    return true
  }

  const filterAllocationsByExactMatch = (allocations, searchCriteria) => {
    if (!allocations || !Array.isArray(allocations)) {
      return []
    }
    
    return allocations.filter(allocation => matchesAllCriteria(allocation, searchCriteria))
  }

  const handleFormSubmit = async (formData) => {
    setIsLoading(true)
    setError(null)
    setResults(null)

    console.log('Form submitted with data:', formData)

    try {
      const response = await fetch('http://localhost:8000/api/allocations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      
      console.log('API Response:', {
        httpStatus: response.status,
        responseOk: response.ok,
        dataStatusCode: data.status_code,
        dataSuccess: data.success,
        hasError: !!data.error
      })
      
      // Check both HTTP status and response data for authentication failures
      const isUnauthorized = response.status === 401 || 
                           data.status_code === 401 || 
                           (data.error && data.error.includes('Unauthorized'))
      
      if (response.ok && data.success && !isUnauthorized) {
        console.log('✓ Authentication successful - storing credentials')
        
        // Store credentials only on successful authentication
        if (formData.username && formData.password) {
          credentialsManager.store({
            username: formData.username,
            password: formData.password
          })
        }
        
        // Apply filtering logic
        let processedData = { ...data }
        
        if (data.data && Array.isArray(data.data)) {
          const filteredData = filterAllocationsByExactMatch(data.data, {
            projectCode: formData.projectCode,
            allocStartDate: formData.allocStartDate,
            allocEndDate: formData.allocEndDate
          })
          
          processedData = {
            ...data,
            data: filteredData,
            original_count: data.data.length,
            filtered_count: filteredData.length,
            filter_applied: {
              projectCode: formData.projectCode,
              startDate: formData.allocStartDate,
              endDate: formData.allocEndDate,
              filterType: 'exact_match'
            },
            search_criteria: {
              projectCode: formData.projectCode,
              allocStartDate: formData.allocStartDate,
              allocEndDate: formData.allocEndDate
            },
            message: filteredData.length > 0 
              ? `Found ${filteredData.length} exact match(es) for project ${formData.projectCode} with dates ${formData.allocStartDate} to ${formData.allocEndDate}`
              : `No exact matches found for project ${formData.projectCode} with dates ${formData.allocStartDate} to ${formData.allocEndDate}. Try different criteria.`
          }
        }
        
        setResults(processedData)
        setDashboardView('results')
        credentialsManager.extend()
        
      } else if (isUnauthorized) {
        console.log('✗ Authentication failed - clearing session and forcing credential re-entry')
        
        // Clear all stored credentials immediately
        credentialsManager.clear()
        
        // Force form to completely re-render with empty credentials
        setFormKey(prev => prev + 1)
        
        const errorMsg = 'Authentication failed. Please check your username and password.'
        setError(errorMsg)
        setErrors([errorMsg])
        setDashboardView('request')
        
      } else {
        console.log('✗ Request failed with other error')
        
        const errorMsg = data.error || 'An error occurred while processing your request.'
        setError(errorMsg)
        setErrors([errorMsg])
        setDashboardView('request')
      }
      
    } catch (err) {
      console.error('✗ Network Error:', err)
      
      // Clear credentials on network errors
      credentialsManager.clear()
      setFormKey(prev => prev + 1)
      
      const errorMsg = 'Network error: Unable to connect to the server. Please check your connection and try again.'
      setError(errorMsg)
      setErrors([errorMsg])
      setDashboardView('request')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewRequest = () => {
    setResults(null)
    setError(null)
    setErrors([])
    setDashboardView('request')
  }

  const handleLogout = () => {
    console.log('Logging out - clearing all session data')
    credentialsManager.clear()
    setResults(null)
    setError(null)
    setErrors([])
    setDashboardView('request')
    setFormKey(prev => prev + 1) // Force form reset
  }

  const handleDismissErrors = () => {
    setErrors([])
  }

  // Always check stored credentials directly from storage
  const storedCredentials = credentialsManager.get()

  return (
    <>
      <Layout 
        user={{ username: storedCredentials?.username || 'Guest' }} 
        onLogout={handleLogout}
      >
        <div className="dashboard-content">
          {/* Clean Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="dashboard-welcome"
          >
            <div className="welcome-content-clean">
              <div className="welcome-text">
                <h1>Welcome to Project Allocations Dashboard</h1>
                <p>Manage your project allocations efficiently</p>
                {storedCredentials ? (
                  <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Session active for {storedCredentials.username}</span>
                  </div>
                ) : (
                  <div className="mt-2 flex items-center gap-2 text-sm text-orange-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Authentication required - Please provide credentials</span>
                  </div>
                )}
              </div>
              <div className="welcome-stats">
                <div className="stat-item">
                  <div className="stat-number">12</div>
                  <div className="stat-label">Active Projects</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{storedCredentials ? 'Ready' : 'Waiting'}</div>
                  <div className="stat-label">Status</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Available</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Professional Navigation */}
          <div className="dashboard-nav">
            <div className="nav-tabs">
              <button
                onClick={() => setDashboardView('request')}
                className={`nav-tab ${dashboardView === 'request' ? 'active' : ''}`}
              >
                <div className="tab-icon">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="tab-content">
                  <div className="tab-title">New Request</div>
                  <div className="tab-subtitle">Create allocation request</div>
                </div>
              </button>
              
              {results && (
                <button
                  onClick={() => setDashboardView('results')}
                  className={`nav-tab ${dashboardView === 'results' ? 'active' : ''}`}
                >
                  <div className="tab-icon">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="tab-content">
                    <div className="tab-title">View Results</div>
                    <div className="tab-subtitle">Allocation data & insights</div>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          {dashboardView === 'request' && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="dashboard-form-container"
            >
              <AllocationForm 
                key={formKey} // Force complete re-render on auth failure
                onSubmit={handleFormSubmit} 
                error={error} 
              />
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card"
            >
              <div className="loading-container">
                <div className="loading-spinner" />
                <h3 className="loading-title">Processing Your Request</h3>
                <p className="loading-subtitle">Authenticating and fetching allocation data...</p>
              </div>
            </motion.div>
          )}

          {results && dashboardView === 'results' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="dashboard-results-container"
            >
              <ResultsDisplay 
                results={results} 
                onNewRequest={handleNewRequest}
              />
            </motion.div>
          )}
        </div>
      </Layout>

      {/* Error Notification */}
      <ErrorNotification 
        errors={errors} 
        onDismiss={handleDismissErrors}
      />
    </>
  )
}