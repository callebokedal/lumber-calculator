import { Outlet } from 'react-router-dom'
import { TopNav } from './TopNav'

/**
 * Root layout: top nav + scrollable content area.
 */
export function AppShell() {
  return (
    <div className="flex flex-col h-screen bg-stone-950 text-stone-100">
      <TopNav />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  )
}
