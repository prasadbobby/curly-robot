import { motion } from 'framer-motion'

export function ErrorDisplay({ title, message, onRetry, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`error-state ${className}`}
    >
      <div className="error-state-icon">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="error-state-title">{title}</h3>
      <div className="error-state-message">{message}</div>
      {onRetry && (
        <div className="error-state-actions">
          <button onClick={onRetry} className="btn btn-primary">
            Try Again
          </button>
        </div>
      )}
    </motion.div>
  )
}