import './globals.css'

export const metadata = {
  title: 'Project Allocations Dashboard',
  description: 'Professional dashboard for managing project allocations',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}