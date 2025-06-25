import { motion } from 'framer-motion'

export default function LoadingSpinner({ size = 'md', text = '', className = '' }) {
  const sizeClasses = {
    sm: { width: '1rem', height: '1rem' },
    md: { width: '2rem', height: '2rem' },
    lg: { width: '3rem', height: '3rem' },
    xl: { width: '4rem', height: '4rem' }
  }

  return (
    <div className={`loading-container ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="loading-spinner"
        style={sizeClasses[size]}
      />
      {text && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="loading-text">{text}</div>
          <div className="loading-subtext">Please wait while we process your request</div>
        </motion.div>
      )}
    </div>
  )
}