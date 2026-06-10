import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AppShell() {
  return (
    <div className="flex min-h-svh">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
