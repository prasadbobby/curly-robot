import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout({ children, user, onLogout }) {
  return (
    <div className="dashboard-layout">
      <Header user={user} onLogout={onLogout} />
      <div className="main-layout">
        <Sidebar />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  )
}