import { NavLink } from 'react-router-dom'

import { navigationItems } from '@/layouts/layoutConfig'

type AppSidebarProps = {
  isOpen: boolean
  onClose: () => void
}

const navLinkBase =
  'group flex items-start gap-3 rounded-lg px-4 py-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500'

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  return (
    <>
      <button
        type="button"
        aria-label="Close sidebar overlay"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-slate-950/60 transition md:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-80 flex-col border-r border-slate-200 bg-white p-5 shadow-sm transition-transform duration-300 md:sticky md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">
              Perpus
            </p>
            <h1 className="mt-2 text-lg font-bold text-slate-900">Technical Test</h1>
          </div>
        </div>

        <nav className="mt-6 flex-1 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `${navLinkBase} ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-900 ring-1 ring-inset ring-indigo-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <span className="mt-0.5 rounded-lg bg-slate-100 p-2 text-slate-600 transition group-hover:bg-slate-200">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500 group-hover:text-slate-700">
                    {item.description}
                  </span>
                </span>
              </NavLink>
            )
          })}
        </nav>
      </aside>
    </>
  )
}