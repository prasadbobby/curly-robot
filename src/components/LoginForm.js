'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

export default function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.username || !formData.password) {
      setError('Please enter both username and password')
      return
    }

    setIsLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const userData = {
        username: formData.username,
        password: formData.password,
        loginTime: new Date().toISOString()
      }

      localStorage.setItem('user', JSON.stringify(userData))
      onLogin(userData)
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-form-card">
      <div className="form-header">
        <h3>Welcome Back</h3>
        <p>Please sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-alert"
          >
            <div className="error-icon">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <span>{error}</span>
          </motion.div>
        )}

        <div className="input-group">
          <label className="input-label">Username</label>
          <div className="input-wrapper">
            <div className="input-icon">
              <UserIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your username"
              required
              autoComplete="username"
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <div className="input-wrapper">
            <div className="input-icon">
              <LockClosedIcon className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="submit-btn"
        >
          {isLoading ? (
            <>
              <div className="btn-spinner" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRightIcon className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="form-footer">
          <p>Use your organization credentials to access the system</p>
          <div className="security-badges">
            <div className="security-item">
              <div className="security-dot success"></div>
              <span>SSL Encrypted</span>
            </div>
            <div className="security-item">
              <div className="security-dot info"></div>
              <span>Enterprise Security</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}