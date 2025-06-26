'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function ErrorNotification({ errors = [], onDismiss }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (errors.length > 0) {
      setIsVisible(true)
    }
  }, [errors])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      onDismiss?.()
    }, 300)
  }

  if (errors.length === 0) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="error-notification"
        >
          <div className="error-notification-content">
            <div className="error-notification-icon">
              <ExclamationTriangleIcon className="w-5 h-5" />
            </div>
            <div className="error-notification-text">
              <span className="error-count">{errors.length} error{errors.length > 1 ? 's' : ''}</span>
              <span className="error-message">
                {errors.length === 1 ? errors[0] : 'Multiple errors occurred'}
              </span>
            </div>
            <button 
              onClick={handleDismiss}
              className="error-notification-close"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}