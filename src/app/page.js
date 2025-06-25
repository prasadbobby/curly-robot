'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/LoginForm'
import { motion } from 'framer-motion'

export default function Home() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  const handleLogin = (userData) => {
    setUser(userData)
    router.push('/dashboard')
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Branding */}
        <div className="login-brand">
          <div className="brand-content">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="brand-logo-large"
            >
              <div className="logo-circle">
                <span>PA</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="brand-info"
            >
              <h1>Project Allocations</h1>
              <h2>Management System</h2>
              <p>Streamline your project resource allocation with our comprehensive management platform</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="brand-features"
            >
              <div className="feature-item">
                <div className="feature-icon">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Real-time allocation tracking</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span>Advanced analytics & reporting</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span>Enterprise-grade security</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="form-wrapper"
          >
            <LoginForm onLogin={handleLogin} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}