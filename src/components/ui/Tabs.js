'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export function Tabs({ defaultTab, children, className = '' }) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <div className={`tabs-container ${className}`}>
      <div className="tabs-header">
        <nav className="tabs-nav">
          {children.map((child) => (
            <button
              key={child.props.value}
              onClick={() => setActiveTab(child.props.value)}
              className={`tab-button ${activeTab === child.props.value ? 'active' : ''}`}
            >
              {child.props.icon && <child.props.icon className="w-4 h-4" />}
              {child.props.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="tab-content">
        {children.find(child => child.props.value === activeTab)}
      </div>
    </div>
  )
}

export function TabPanel({ value, label, icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}