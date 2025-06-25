'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout/Layout'
import AllocationForm from '@/components/AllocationForm'
import ResultsDisplay from '@/components/ResultsDisplay'
import LoadingSpinner from '@/components/LoadingSpinner'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [dashboardView, setDashboardView] = useState('request')
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/')
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  const handleFormSubmit = async (formData) => {
    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('http://localhost:8000/api/allocations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          password: user.password,
          ...formData
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setResults(data)
        setDashboardView('results')
      } else {
        setError(data.error || 'An error occurred')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewRequest = () => {
    setResults(null)
    setError(null)
    setDashboardView('request')
  }

  if (!user) {
    return (
      <div className="dashboard-layout">
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="space-y-8">
        {/* Clean Welcome Header - No Purple */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="dashboard-welcome"
        >
          <div className="welcome-content-clean">
            <div className="welcome-text">
              <h1>Welcome back, {user.username}!</h1>
              <p>Manage your project allocations efficiently</p>
            </div>
            <div className="welcome-stats">
              <div className="stat-item">
                <div className="stat-number">12</div>
                <div className="stat-label">Active Projects</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">85%</div>
                <div className="stat-label">Utilization</div>
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
                <span className="tab-title">New Request</span>
                <span className="tab-subtitle">Create allocation request</span>
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
                  <span className="tab-title">View Results</span>
                  <span className="tab-subtitle">Allocation data & insights</span>
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
            className="max-w-4xl mx-auto"
          >
            <AllocationForm onSubmit={handleFormSubmit} />
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
              <p className="loading-subtitle">Fetching allocation data from the server...</p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="card">
              <div className="card-body text-center">
                <div className="error-icon-large">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Request Failed</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button onClick={handleNewRequest} className="btn btn-primary">
                  Try Again
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {results && dashboardView === 'results' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            <ResultsDisplay 
              results={results} 
              onNewRequest={handleNewRequest}
            />
          </motion.div>
        )}
      </div>
    </Layout>
  )
}