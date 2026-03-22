import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

/**
 * Root layout: sidebar + main content area.
 */
export function AppShell() {
  return (
    <div className="flex h-screen bg-stone-950 text-stone-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
