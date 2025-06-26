'use client'

import { 
  HomeIcon, 
  CircleStackIcon, 
  CalendarIcon,
  ChartBarIcon,
  UsersIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

export default function Sidebar({ activeSection = 'dashboard' }) {
  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: HomeIcon,
      href: '/dashboard',
      description: 'Overview & Analytics'
    },
    {
      id: 'allocations',
      name: 'Allocations',
      icon: CircleStackIcon,
      href: '/dashboard',
      description: 'Project Allocations'
    },
    {
      id: 'calendar',
      name: 'Calendar',
      icon: CalendarIcon,
      href: '#',
      description: 'Schedule Overview'
    },
    {
      id: 'reports',
      name: 'Reports',
      icon: ChartBarIcon,
      href: '#',
      description: 'Analytics & Reports'
    },
    {
      id: 'team',
      name: 'Team',
      icon: UsersIcon,
      href: '#',
      description: 'Team Management'
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Cog6ToothIcon,
      href: '#',
      description: 'System Configuration'
    }
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <nav className="nav-section">
          <h2 className="nav-title">Navigation</h2>
          <ul className="nav-list">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              
              return (
                <li key={item.id} className="nav-item">
                  <a
                    href={item.href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <div className="nav-icon-wrapper">
                      <Icon className="nav-icon" />
                    </div>
                    <div className="nav-text">
                      <div className="nav-name">{item.name}</div>
                      <div className="nav-description">{item.description}</div>
                    </div>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="help-section">
          <div className="help-icon">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3>Need Help?</h3>
          <p>Get assistance with project allocations and system features.</p>
          <button className="help-btn">Contact Support</button>
        </div>
      </div>
    </aside>
  )
}