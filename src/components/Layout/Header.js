'use client'

import { ArrowRightOnRectangleIcon, UserIcon } from '@heroicons/react/24/outline'

export default function Header({ user, onLogout }) {
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

        {user && (
          <div className="user-menu">
            <div className="user-profile">
              <div className="user-avatar">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="user-info">
                <h3>{user.username}</h3>
                <p>Administrator</p>
              </div>
            </div>
            
            <button onClick={onLogout} className="logout-btn">
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}