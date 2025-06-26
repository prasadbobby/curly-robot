'use client'

import { ArrowRightOnRectangleIcon, UserIcon } from '@heroicons/react/24/outline'
import { credentialsManager } from '@/utils/credentials'

export default function Header({ user, onLogout }) {
  // Always get fresh credentials from storage
  const storedCredentials = credentialsManager.get()
  
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="brand">
          <div className="brand-logo">
            PA
          </div>
          <div className="brand-text">
            <h1>Project Allocations</h1>
            <p>Management Dashboard</p>
          </div>
        </div>

        <div className="user-menu">
          <div className="user-profile">
            <div className="user-avatar">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="user-info">
              <h3>{storedCredentials?.username || 'Guest'}</h3>
              <p>{storedCredentials ? 'Authenticated User' : 'Not Authenticated'}</p>
            </div>
          </div>
          
          <button onClick={onLogout} className="logout-btn">
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            {storedCredentials ? 'Sign Out' : 'Clear Session'}
          </button>
        </div>
      </div>
    </header>
  )
}