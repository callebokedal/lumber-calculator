import { NavLink } from 'react-router-dom'
import { useAppStore } from '../../store/app.store'
import { t } from '../../utils/i18n'

/**
 * Top navigation bar (mobile-first).
 */
export function TopNav() {
  const language = useAppStore((s) => s.language)

  const linkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-stone-700 text-white'
        : 'text-stone-400 hover:bg-stone-700 hover:text-white'
    }`

  return (
    <header className="shrink-0 bg-stone-900 border-b border-stone-700">
      <div className="flex items-center justify-between px-4 h-12">
        <span className="text-white font-semibold text-sm tracking-wide">Optimize Wood Cut</span>
        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
            </svg>
            <span className="hidden sm:inline">{t('nav.projects', language)}</span>
          </NavLink>
          <NavLink to="/settings" className={linkClass}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden sm:inline">{t('nav.settings', language)}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
